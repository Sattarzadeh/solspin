import logger from "@solspin/logger";
import { ApiHandler } from "sst/node/api";
import { listCases } from "../../../../../game-engine/src/repository/caseRepository";
export const handler = ApiHandler(async (event) => {
  logger.info(`Get all cases lambda invoked`);
  try {
    const cases = await listCases();
    return {
      statusCode: 200,
      body: JSON.stringify(cases),
    };
  } catch (error) {
    logger.error("Error getting all cases:", (error as Error).message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
});
