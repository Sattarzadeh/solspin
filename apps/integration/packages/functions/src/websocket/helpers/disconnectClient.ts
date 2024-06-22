import logger from "@solspin/logger";
import {
  ApiGatewayManagementApiClient,
  DeleteConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

export const disconnectClient = async (domain: string, stage: string, connectionId: string) => {
  if (!connectionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "connectionId is required" }),
    };
  }

  try {
    const callbackUrl = `https://${domain}/${stage}`;
    const client = new ApiGatewayManagementApiClient({ endpoint: callbackUrl });

    const params = {
      ConnectionId: connectionId,
    };

    const command = new DeleteConnectionCommand(params);
    await client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User connection closed" }),
    };
  } catch (error) {
    logger.error(
      `Error occured in connection close lambda for connectionId: ${connectionId} error: ${error}`
    );
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to close connection",
        error,
      }),
    };
  }
};
