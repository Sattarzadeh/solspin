import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { CreateBetRequestSchema, CreateBetResponseSchema } from "@solpin/types";
import { recordBet } from "../../../data-access/record-bet";
import { errorResponse, successResponse } from "../../../utils/gateway-responses";
import { getLogger } from "../../../utils/logger";

const logger = getLogger("create-bet-handler");

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  logger.info("Received create bet request", { event });

  try {
    const parsedBody = JSON.parse(event.body || "{}");

    const createBetRequest = CreateBetRequestSchema.parse(parsedBody);

    const { userId, gameId, amountBet, outcome, outcomeAmount } = createBetRequest;

    const createdBet = await recordBet(userId, gameId, amountBet, outcome, outcomeAmount);

    const response = CreateBetResponseSchema.parse(createdBet);

    logger.info("Bet created successfully", { response, createdBet });

    return successResponse(response);
  } catch (error) {
    logger.error("Error creating bet", { error });

    return errorResponse(error as Error);
  }
};
