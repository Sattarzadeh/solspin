import { ApiHandler } from "sst/node/api";
import { handleSpin } from "../../../../../game-engine/src/handlers/caseOpeningHandler";
import { SpinPayload } from "@solspin/orchestration-types";
import logger from "@solspin/logger";
export const handler = ApiHandler(async (event) => {
  logger.info(`Perform spin lambda invoked with event body: ${event.body}`);
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Request body is missing",
      }),
    };
  }

  let parsedBody: SpinPayload;

  try {
    parsedBody = JSON.parse(event.body);
    console.log("Parsed body:", parsedBody);
  } catch (parseError) {
    console.error("Failed to parse body:", parseError);
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid JSON format",
        error: (parseError as Error).message,
      }),
    };
  }

  const { caseModel, serverSeed, clientSeed } = parsedBody;

  if (!caseModel || !serverSeed || !clientSeed) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "caseModel, serverSeed, or clientSeed is missing",
      }),
    };
  }

  try {
    const rewardItem = await handleSpin(caseModel, serverSeed, clientSeed);

    return {
      statusCode: 200,
      body: JSON.stringify(rewardItem),
    };
  } catch (error) {
    console.error("Error in handleSpin:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: (error as Error).message || JSON.stringify(error),
      }),
    };
  }
});
