import { ZodError } from "zod";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { UpdateUserBalanceRequestSchema } from "@solspin/types";
import { errorResponse, successResponse } from "@solspin/gateway-responses";
import { getLogger } from "@solspin/logger";
import { updateWalletBalance } from "../../../data-access/updateWalletBalance";

const logger = getLogger("update-balance");

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  logger.info("Received update balance request", { event });

  let userId: string | undefined;
  let amount: number | undefined;

  try {
    const parsedBody = JSON.parse(event.body || "{}");

    const updateBalanceRequest = UpdateUserBalanceRequestSchema.parse(parsedBody);

    ({ userId, amount } = updateBalanceRequest);

    if (amount <= 0) {
      return errorResponse(new Error("Amount must be greater than 0"), 400);
    }

    const amountFpn = Math.round(amount * 100);
    await updateWalletBalance(userId, amountFpn);
    logger.info("Deposit successful", { userId, amount });

    return successResponse({
      message: "Deposit successful",
      data: {
        userId,
        amount: amount,
      },
    });
  } catch (error) {
    logger.error("Error processing update request", { error, userId });

    if (error instanceof ZodError) {
      return errorResponse(error, 400);
    }

    return errorResponse(new Error("Internal server error"), 500);
  }
};
