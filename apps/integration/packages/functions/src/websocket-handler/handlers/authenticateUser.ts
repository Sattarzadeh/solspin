import { WebSocketApiHandler } from "sst/node/websocket-api";
import { authenticateUser } from "../../../../../../websocket-handler/src/services/handleConnections";

export const handler = WebSocketApiHandler(async (event) => {
  const connectionId = event.requestContext?.connectionId;
  console.log(event.body);
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Request body is missing" }),
    };
  }

  let parsedBody;
  try {
    parsedBody = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid JSON format" }),
    };
  }

  const userId: string = parsedBody?.userId;
  console.log(`userId: ${userId} || connectionId: ${connectionId}`);
  if (!connectionId || !userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "connectionId and userId are required" }),
    };
  }

  try {
    await authenticateUser(connectionId, userId);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User has been marked as authenticated" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to mark user as authenticated",
        error: (error as Error).message,
      }),
    };
  }
});
