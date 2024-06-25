import { WebSocketApiHandler } from "sst/node/websocket-api";
import { authenticateUser } from "../helpers/handleConnections";
import { callAuthorizer } from "../helpers/callAuthorizer";
import { getLogger } from "@solspin/logger";

const logger = getLogger("authenticate-user-handler");

export const handler = WebSocketApiHandler(async (event) => {
  const connectionId = event.requestContext?.connectionId;

  logger.info(`Authenticate user lambda handler invoked with connectionId: ${connectionId}`);
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

  const token: string = parsedBody?.token;

  logger.info(`Received token: ${token} || connectionId: ${connectionId} from event body`);
  if (!connectionId || !token) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "connectionId and token are required" }),
    };
  }

  try {
    const authorizerResponse = await callAuthorizer(token);
    if (authorizerResponse.statusCode !== 200) {
      logger.error(`Authorizer returned status code: ${authorizerResponse.statusCode}`);
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Unauthorized" }),
      };
    }
    const parsedBody = JSON.parse(authorizerResponse.body);
    const userId = parsedBody.userId;

    if (!userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "UserId not found in authorizer payload" }),
      };
    }
    await authenticateUser(connectionId, userId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User has been marked as authenticated" }),
    };
  } catch (error) {
    logger.error(`Error in authenticate user lambda: ${(error as Error).message}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to mark user as authenticated",
        error: (error as Error).message,
      }),
    };
  }
});
