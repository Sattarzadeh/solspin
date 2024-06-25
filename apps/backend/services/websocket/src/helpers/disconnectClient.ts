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
};
