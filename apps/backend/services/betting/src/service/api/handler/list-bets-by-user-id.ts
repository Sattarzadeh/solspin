import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  BetQuerySchema,
  GetBetsByUserIdRequestSchema,
  GetBetsByUserIdResponseSchema,
} from "@solpin/types";
import { queryBetsByUserId } from "../../../data-access/query-by-user-id";
import { errorResponse, successResponse } from "../../../utils/gateway-responses";
import { getLogger } from "../../../utils/logger";

const logger = getLogger("get-bets-by-user-id-handler");

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  logger.info("Received get bets by user ID request", { event });

  try {
    const { userId } = GetBetsByUserIdRequestSchema.parse(event.pathParameters);
    const query = BetQuerySchema.parse(event.queryStringParameters);

    const { gameOutcome, outcomeAmount, betAmount } = query;

    const bets = await queryBetsByUserId(userId, gameOutcome, outcomeAmount, betAmount);

    const response = GetBetsByUserIdResponseSchema.parse(bets);

    logger.info("Bets retrieved successfully", { response });

    return successResponse(response);
  } catch (error) {
    logger.error("Error retrieving bets", { error });

    return errorResponse(error as Error);
  }
};
