import { DynamoDBClient, ScanCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { ApiGatewayManagementApi } from "aws-sdk";
import logger from "@solspin/logger";
import { handleConnectionClose } from "apps/websocket-handler/src/services/handleConnections";
import { Table } from "sst/node/table";
import { ApiHandler } from "sst/node/api";

const dynamoDbClient = new DynamoDBClient({});
const TABLE_NAME = process.env.TABLE_NAME;

export const handler = ApiHandler(async (event) => {
  try {
    const apiG = new ApiGatewayManagementApi({
      endpoint: `${process.env.DOMAIN}`,
    });

    const scanParams = {
      TableName: TABLE_NAME,
      ProjectionExpression: "connectionId",
    };

    const scanResult = await dynamoDbClient.send(new ScanCommand(scanParams));
    const connections = scanResult.Items || [];

    for (const connection of connections) {
      const connectionId = connection.connectionId.S;
      if (!connectionId) continue;
      try {
        await apiG
          .postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify({ message: "ping" }),
          })
          .promise();
      } catch (error) {
        if (error.name === "GoneException") {
          // Connection is closed, delete it from the table
          logger.info(`Connection ${connectionId} is closed. Deleting from table.`);
          await handleConnectionClose(connectionId);
        } else {
          logger.error(
            `Failed to send ping to connection ${connectionId}: ${(error as Error).message}`
          );
        }
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Finished pruning closed connections",
      }),
    };
  } catch (error) {
    logger.error(`Error pruning connections: ${(error as Error).message}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to close connection",
        error: (error as Error).message,
      }),
    };
  }
});
