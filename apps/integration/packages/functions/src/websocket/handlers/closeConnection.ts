import logger from "@solspin/logger";
import { WebSocketApiHandler } from "sst/node/websocket-api";
import {
  ApiGatewayManagementApiClient,
  DeleteConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

export const handler = WebSocketApiHandler(async (event) => {
  const connectionId = event.requestContext?.connectionId;
  logger.info(`Handle connection close lambda invoked with connectionId: ${connectionId}`);
  if (!connectionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "connectionId is required" }),
    };
  }

  try {
    const domain = event.requestContext.domainName;
    const stage = event.requestContext.stage;

    const connectionId = event.requestContext.connectionId;
    const callbackUrl = `https://${domain}/${stage}`;
    console.log(callbackUrl);
    const client = new ApiGatewayManagementApiClient({ endpoint: callbackUrl });

    const params = {
      ConnectionId: connectionId,
    };

    const command = new DeleteConnectionCommand(params);
    client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User connection closed" }),
    };
  } catch (error) {
    logger.error(
      `Error occured in connection close lambda for connectionId: ${connectionId} error: ${
        (error as Error).message
      }`
    );
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to close connection",
        error: (error as Error).message,
      }),
    };
  }
});
