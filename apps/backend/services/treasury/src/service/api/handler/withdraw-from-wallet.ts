import { ZodError } from "zod";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { errorResponse, successResponse } from "@solspin/gateway-responses";
import { getLogger } from "@solspin/logger";
import { v4 as uuidv4 } from "uuid";
import { BuildTransactionResponse, WithdrawRequestSchema } from "@solspin/types";
import { buildTransaction } from "../../../blockchain/buildTransaction";
import { Commitment, Connection } from "@solana/web3.js";
import { COMMITMENT_LEVEL, SOLANA_RPC_URL } from "../../../foundation/runtime";
import { broadcastTransactionAndVerify } from "../../../blockchain/broadcastTransactionAndVerify";
import { recordTransaction } from "../../../data-access/record-transaction";
import { TransactionType } from "../../../foundation/types";

const logger = getLogger("treasury-withdraw-handler");
let connection: Connection;

/**
 * Initiate a withdrawal from the treasury wallet. The user must provide a wallet address to send the funds to.
 * The amount to withdraw must be greater than 0.1 SOL. The transaction is built and broadcasted to the SOL network.
 * @param event The API Gateway event
 * @returns The response object
 **/

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!connection) {
    connection = new Connection(SOLANA_RPC_URL, COMMITMENT_LEVEL as Commitment);
  }

  const withdrawId = uuidv4(); // Generate a unique ID for this withdrawal attempt
  logger.info("Received withdraw request", { event, withdrawId });

  let userId = "";
  let amount: number;
  let walletAddress: string;

  try {
    const parsedBody = JSON.parse(event.body || "{}");

    const withdrawRequest = WithdrawRequestSchema.parse(parsedBody);

    ({ userId, amount, walletAddress } = withdrawRequest);

    if (amount < 0.1) {
      return errorResponse(new Error("Minimum withdrawal amount is 0.1 SOL"), 400);
    }

    const { transactionSignature, blockhash, lastValidBlockHeight }: BuildTransactionResponse =
      await buildTransaction(walletAddress, amount, connection);

    const txnSignature = await broadcastTransactionAndVerify(
      transactionSignature.serialize(),
      connection,
      COMMITMENT_LEVEL,
      blockhash,
      lastValidBlockHeight
    );

    logger.info(
      `User: ${userId}, Withdrawal successful. Amount: ${amount} SOL, Transaction signature: ${txnSignature}`,
      { txnSignature }
    );

    await recordTransaction(
      withdrawId,
      userId,
      amount,
      walletAddress,
      txnSignature,
      TransactionType.WITHDRAW
    );

    return successResponse(txnSignature);
  } catch (error) {
    logger.error(`Error processing withdrawal request for ${userId}`, { error, withdrawId });

    if (error instanceof ZodError) {
      return errorResponse(error, 400);
    }

    return errorResponse(new Error("Internal server error"), 500);
  }
};
