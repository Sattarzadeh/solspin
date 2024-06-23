import logger from "./logger";
import { ApiGatewayManagementApi } from "aws-sdk";

export async function sendWebSocketMessage(
  endpoint: string,
  connectionId: string,
  message: object
) {
  const apiG = new ApiGatewayManagementApi({
    endpoint,
  });

  logger.info(`Sending message to client with connectionId: ${connectionId}`);

  await apiG
    .postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify(message),
    })
    .promise();
}
