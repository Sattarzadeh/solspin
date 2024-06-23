import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  BetQuerySchema,
  GetBetsByGameIdRequestSchema,
  GetBetsByGameIdResponseSchema,
} from "@solpin/types";
import { queryBetsByGameId } from "../../../data-access/query-by-game-id";
import { errorResponse, successResponse } from "../../../utils/gateway-responses";
import { getLogger } from "../../../utils/logger";

const logger = getLogger("get-bets-by-game-id-handler");

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  logger.info("Received get bets by game ID request", { event });

  try {
    const { gameId } = GetBetsByGameIdRequestSchema.parse(event.pathParameters);

    const query = BetQuerySchema.parse(event.queryStringParameters);

    const { gameOutcome, outcomeAmount, betAmount } = query;

    const bets = await queryBetsByGameId(gameId, gameOutcome, outcomeAmount, betAmount);

    const response = GetBetsByGameIdResponseSchema.parse(bets);

    logger.info("Bets retrieved successfully", { response });

    return successResponse(response);
  } catch (error) {
    logger.error("Error retrieving bets", { error });

    return errorResponse(error as Error);
  }
};
