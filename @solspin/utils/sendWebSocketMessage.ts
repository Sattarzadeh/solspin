import { ApiGatewayManagementApi } from "aws-sdk";

export async function sendWebSocketMessage(
  endpoint: string,
  connectionId: string,
  message: object
) {
  const apiG = new ApiGatewayManagementApi({
    endpoint,
  });

  await apiG
    .postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify(message),
    })
    .promise();
}
