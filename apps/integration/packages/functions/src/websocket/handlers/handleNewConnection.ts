import logger from "@solspin/logger";
import { WebSocketApiHandler } from "sst/node/websocket-api";
import { handleNewConnection } from "../../../../../../websocket-handler/src/services/handleConnections";

const whiteListedOrigins = ["https://piehost.com"];
export const handler = WebSocketApiHandler(async (event) => {
  const connectionId = event.requestContext?.connectionId;
  const origin = event.headers?.Origin;
  logger.info(
    `Handle new connection lambda invoked with connectionId: ${connectionId} and origin: ${origin}`
  );
  try {
    if (!connectionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "connectionId is required" }),
      };
    }

    if (!origin || !whiteListedOrigins.includes(origin)) {
      logger.warn(`Connection attempt from non-whitelisted origin: ${origin}`);
      return {
        statusCode: 403,
        body: JSON.stringify({ message: "Forbidden: Origin not allowed" }),
      };
    }

    await handleNewConnection(connectionId);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "New connection handled" }),
    };
  } catch (error) {
    logger.error(`Error occured in handle new connection lambda: ${(error as Error).message}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to handle new connection",
        error: (error as Error).message,
      }),
    };
  }
});
