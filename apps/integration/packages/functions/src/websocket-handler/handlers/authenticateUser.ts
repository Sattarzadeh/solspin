import { ApiHandler } from "sst/node/api";
import { authenticateUser } from "../../../../../../websocket-handler/src/services/handleConnections";

export const handler = ApiHandler(async (event) => {
  const connectionId = event.queryStringParameters?.connectionId;
  const userId = event.queryStringParameters?.userId;
  if (!connectionId || !userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "connectionId and userId is required" }),
    };
  }

  try {
    await authenticateUser(connectionId, userId);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User had been marked as authenticated" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to mark user as authenticated",
        error: error.message,
      }),
    };
  }
});
