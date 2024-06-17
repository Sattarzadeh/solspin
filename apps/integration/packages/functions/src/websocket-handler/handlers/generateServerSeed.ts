// sst/src/handlers/generateSeedHandler.ts
import logger from "@solspin/logger";
import { ApiHandler } from "sst/node/api";
import { WebSocketApiHandler } from "sst/node/websocket-api";
import { generateServerSeed } from "../../../../../../websocket-handler/src/services/handleConnections"; // Adjust the path as necessary

export const handler = WebSocketApiHandler(async (event) => {
  const connectionId = event.requestContext?.connectionId;
  logger.info(`Generate seed lambda invoked with connectionId: ${connectionId}`);
  if (!connectionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "connectionId is required" }),
    };
  }

  try {
    const serverSeed = await generateServerSeed(connectionId);
    logger.info(`Received server seed: ${connectionId}`);
    return {
      statusCode: 200,
      body: JSON.stringify({ serverSeed }),
    };
  } catch (error) {
    logger.error(`Error occured in generate seed lambda: ${(error as Error).message}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to generate server seed",
        error: (error as Error).message,
      }),
    };
  }
});
