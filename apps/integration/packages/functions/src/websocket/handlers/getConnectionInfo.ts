import { ApiHandler } from "sst/node/api";
import { getConnectionInfo } from "../../../../../../websocket-handler/src/services/handleConnections";
import { ConnectionInfo } from "@solspin/websocket-types";
import logger from "@solspin/logger";
export const handler = ApiHandler(async (event) => {
  const connectionId = event.queryStringParameters?.connectionId;
  logger.info(`Get connection lambda called with connectionId: ${connectionId}`);
  if (!connectionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "connectionId is required" }),
    };
  }

  try {
    const connectionInfo: ConnectionInfo | null = await getConnectionInfo(connectionId);
    return {
      statusCode: 200,
      body: JSON.stringify({ connectionInfo }),
    };
  } catch (error) {
    logger.error(`Error occured in get connection lambda: ${(error as Error).message}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to get connection info",
        error: (error as Error).message,
      }),
    };
  }
});
