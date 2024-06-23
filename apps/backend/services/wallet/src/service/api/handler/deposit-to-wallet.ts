import { ZodError } from "zod";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DepositToWalletRequestSchema } from "@solspin/types";
import { errorResponse, successResponse } from "@solspin/gateway-responses";
import { getLogger } from "@solspin/logger";
import { v4 as uuidv4 } from "uuid";
import { lockWallet } from "../../../data-access/lockWallet";
import { getCurrentPrice } from "../../../remote/jupiterClient";
import { unlockWallet } from "../../../data-access/unlockWallet";
import { deposit } from "../../../data-access/deposit";

const logger = getLogger("withdraw-handler");

// Mocked treasury service
const treasuryService = {
  creditWallet: async (
    userId: string,
    walletAddress: string,
    txnSignature: string
  ): Promise<any> => {
    // Simulate API call
    return {
      depositAmountInCrypto: 1,
      transactionId: "mocked-txn-signature",
    };
  },
};

/**
 * Initiates a withdrawal from the user's wallet. The amount is reserved first,
 * then the treasury service is called to credit the wallet, and finally the withdrawal is finalized. If any step fails, the reservation is released.
 * @param event The API Gateway event
 * @returns The response object
 **/

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const withdrawId = uuidv4(); // Generate a unique ID for this withdrawal attempt
  logger.info("Received deposit request", { event, withdrawId });

  try {
    const parsedBody = JSON.parse(event.body || "{}");

    const depositRequest = DepositToWalletRequestSchema.parse(parsedBody);

    const { userId, walletAddress, txnSignature } = depositRequest;

    if (!walletAddress || !txnSignature) {
      return errorResponse(new Error("Invalid request"), 400);
    }
    try {
      const wallet = await lockWallet(userId);

      // TODO - Implement this in treasury service instead of wallet service
      const { depositAmountInCrypto, transactionId } = await treasuryService.creditWallet(
        userId,
        walletAddress,
        txnSignature
      );

      // Dollars are converted into FPN (floating point number) to avoid floating point arithmetic issues (i.e x100)
      const currentPriceSolFpn = (await getCurrentPrice()) * 100;
      const depositAmountInUsdFpn = Math.round(depositAmountInCrypto * currentPriceSolFpn);

      await deposit(wallet, depositAmountInUsdFpn, transactionId);

      return successResponse({
        message: "Deposit successful",
        txnId: txnSignature,
        depositAmount: depositAmountInUsdFpn / 100,
      });
    } catch (error) {
      logger.error("Error processing withdrawal request", { error, withdrawId });

      if (error instanceof ZodError) {
        return errorResponse(error, 400);
      }

      return errorResponse(new Error("Internal server error"), 500);
    } finally {
      // Always unlock the wallet
      await unlockWallet(userId);
    }
  } catch (error) {
    logger.error("Error processing withdrawal request", { error, withdrawId });

    if (error instanceof ZodError) {
      return errorResponse(error, 400);
    }

    return errorResponse(new Error("Internal server error"), 500);
  }
};
