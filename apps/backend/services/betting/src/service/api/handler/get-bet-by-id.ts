import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { GetBetByIdRequestSchema, GetBetByIdResponseSchema } from "@solspin/types";
import { queryBetById } from "../../../data-access/query-by-id";
import { errorResponse, successResponse } from "../../../utils/gateway-responses";
import { getLogger } from "../../../utils/logger";

const logger = getLogger("get-bet-by-id-handler");

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  logger.info("Received get bet by ID request", { event });

  try {
    const { id } = GetBetByIdRequestSchema.parse(event.pathParameters);

    const bet = await queryBetById(id);

    if (!bet) {
      logger.info("Bet not found", { id });

      return errorResponse(new Error("Bet not found"), 404);
    }

    const response = GetBetByIdResponseSchema.parse(bet);

    logger.info("Bet retrieved successfully", { response });

    return successResponse(response);
  } catch (error) {
    logger.error("Error retrieving bet", { error });

    return errorResponse(error as Error);
  }
};
