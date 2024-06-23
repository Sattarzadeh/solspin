import logger from "@solspin/logger";
import { ApiHandler } from "sst/node/api";
import { getCase } from "../../../../../game-engine/src/repository/caseRepository";
export const handler = ApiHandler(async (event) => {
  const caseId = event.queryStringParameters?.caseId;
  logger.info(`Get case lambda invoked with caseId: ${caseId}`);
  if (!caseId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "caseName is missing" }),
    };
  }

  try {
    const caseData = await getCase(caseId);
    return {
      statusCode: 200,
      body: JSON.stringify(caseData),
    };
  } catch (error) {
    logger.error(`Error getting case data with caseId: ${caseId}:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
});
