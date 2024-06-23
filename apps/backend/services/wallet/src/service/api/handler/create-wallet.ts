import { ZodError } from "zod";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { CreateWalletRequestSchema, CreateWalletsResponseSchema } from "@solspin/types";
import { createWallet } from "../../../data-access/create-wallet";
import { errorResponse, successResponse } from "@solspin/gateway-responses";
import { getLogger } from "@solspin/logger";

const logger = getLogger("create-wallet-handler");

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  logger.info("Received create wallet request", { event });

  try {
    const parsedBody = JSON.parse(event.body || "{}");

    let createWalletRequest;
    try {
      createWalletRequest = CreateWalletRequestSchema.parse(parsedBody);
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error("Validation error creating wallet", { error });
        return errorResponse(error as Error, 400);
      }
      throw error;
    }

    const { userId, walletAddress } = createWalletRequest;

    const createdWallet = await createWallet(userId, walletAddress);
    console.log("createdWallet", createdWallet);
    const response = CreateWalletsResponseSchema.parse(createdWallet);

    logger.info("Wallet created successfully", { response, createdWallet });

    return successResponse(response);
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error("Validation error creating wallet", { error });
      return errorResponse(error as Error, 400);
    }

    logger.error("Error creating wallet", { error });

    return errorResponse(error as Error);
  }
};
