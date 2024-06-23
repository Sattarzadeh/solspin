import { ApiHandler } from "sst/node/api";
import { handleSpin } from "../../../../../game-engine/src/handlers/caseOpeningHandler";
import { SpinPayloadSchema, CreateSpinPayloadRequestSchema } from "@solspin/orchestration-types";
import logger from "@solspin/logger";
import { ZodError } from "zod";

export const handler = ApiHandler(async (event) => {
  try {
    logger.info(`Perform spin lambda invoked with event body: ${event.body}`);
    const parsedBody = JSON.parse(event.body || "{}");

    let spinPayload;
    try {
      spinPayload = CreateSpinPayloadRequestSchema.parse(parsedBody);
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error("Validation error creating spin payload", { error });
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "Validation Error",
            errors: error.errors,
          }),
        };
      }
      throw error;
    }

    const { caseModel, serverSeed, clientSeed } = spinPayload;

    const rewardItem = await handleSpin(caseModel, serverSeed, clientSeed);

    return {
      statusCode: 200,
      body: JSON.stringify(rewardItem),
    };
  } catch (error) {
    logger.error("Error in handleSpin:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: (error as Error).message || JSON.stringify(error),
      }),
    };
  }
});
