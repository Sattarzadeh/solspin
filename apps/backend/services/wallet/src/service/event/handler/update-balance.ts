import { ZodError } from "zod";
import { EventBridgeEvent } from "aws-lambda";
import { errorResponse, successResponse } from "@solspin/gateway-responses";
import { getLogger } from "@solspin/logger";
import { updateWalletBalance } from "../../../data-access/updateWalletBalance";
import { UpdateBalanceEvent, UpdateBalanceEventSchema } from "../schema/schema";

const logger = getLogger("update-balance");

export const handler = async (event: EventBridgeEvent<"event", UpdateBalanceEvent>) => {
  logger.info("Received update balance request", { event });

  let userId: string | undefined;
  let amount: number | undefined;

  try {
    const eventDetails = UpdateBalanceEventSchema.parse(event.detail);

    ({ userId, amount } = eventDetails.payload);
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
