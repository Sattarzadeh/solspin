import logger from "@solspin/logger";
import { ApiHandler } from "sst/node/api";
import { getCase } from "../../../../../game-engine/src/repository/caseRepository";
import { GetCaseByIdRequestSchema, GetCaseByIdResponseSchema } from "@solspin/game-engine-types";
export const handler = ApiHandler(async (event) => {
  try {
    const { caseId } = GetCaseByIdRequestSchema.parse(event.queryStringParameters);
    logger.info(`Get case lambda invoked with caseId: ${caseId}`);
    if (!caseId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "caseName is missing" }),
      };
    }

    const caseData = await getCase(caseId);

    const response = GetCaseByIdResponseSchema.parse(caseData);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    logger.error(`Error getting case data:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
});
