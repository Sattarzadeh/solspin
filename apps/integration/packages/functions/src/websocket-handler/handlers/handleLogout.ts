import { ApiHandler } from "sst/node/api";
import { WebSocketApiHandler } from "sst/node/websocket-api";
import { handleLogout } from "../../../../../../websocket-handler/src/services/handleConnections";

export const handler = WebSocketApiHandler(async (event) => {
  const connectionId = event.requestContext?.connectionId;

  if (!connectionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "connectionId is required" }),
    };
  }

  try {
    await handleLogout(connectionId);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User logged out" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to logout user", error: (error as Error).message }),
    };
  }
});
