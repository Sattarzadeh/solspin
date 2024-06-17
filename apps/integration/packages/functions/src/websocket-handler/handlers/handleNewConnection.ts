import { ApiHandler } from "sst/node/api";
import { WebSocketApiHandler } from "sst/node/websocket-api";
import { handleNewConnection } from "../../../../../../websocket-handler/src/services/handleConnections";

export const handler = WebSocketApiHandler(async (event) => {
  const connectionId = event.requestContext?.connectionId;

  if (!connectionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "connectionId is required" }),
    };
  }

  try {
    await handleNewConnection(connectionId);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "New connection handled" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to handle new connection",
        error: (error as Error).message,
      }),
    };
  }
});
