import { ApiHandler } from "sst/node/api";
import { handleConnectionClose } from "../../../../../../websocket-handler/src/services/handleConnections";

export const handler = ApiHandler(async (event) => {
  const connectionId = event.queryStringParameters?.connectionId;

  if (!connectionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "connectionId is required" }),
    };
  }

  try {
    await handleConnectionClose(connectionId);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Connection closed" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to close connection", error: error.message }),
    };
  }
});
