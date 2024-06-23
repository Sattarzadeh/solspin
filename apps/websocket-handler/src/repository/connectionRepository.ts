import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { ConnectionInfo } from "../models/connectionInfo";
import {
  EnvironmentVariableError,
  SaveConnectionInfoError,
  DeleteConnectionInfoError,
  GetConnectionInfoError,
} from "@solspin/errors";
import logger from "@solspin/logger";

const client = new DynamoDBClient({ region: "eu-west-2" });
const ddbDocClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.TABLE_NAME;

if (!tableName) {
  throw new EnvironmentVariableError("TABLE_NAME");
}

export const saveConnectionInfo = async (
  connectionId: string,
  info: ConnectionInfo
): Promise<void> => {
  const params = {
    TableName: tableName,
    Item: {
      connectionId: connectionId,
      isAuthenticated: info.isAuthenticated,
      userId: info.userId,
      serverSeed: info.serverSeed,
    },
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
  } catch (error) {
    logger.error(
      `Failed to save connection info with connectionId: ${connectionId} error: ${error.message}`
    );
    throw new SaveConnectionInfoError(error as string);
  }
};

export const deleteConnectionInfo = async (connectionId: string): Promise<void> => {
  const params = {
    TableName: tableName,
    Key: {
      connectionId: connectionId,
    },
  };

  try {
    await ddbDocClient.send(new DeleteCommand(params));
  } catch (error) {
    logger.error(
      `Failed to delete connection info with connectionId ${connectionId} error: ${error}`
    );
    throw new DeleteConnectionInfoError(error as string);
  }
};

export const getConnectionInfoFromDB = async (
  connectionId: string
): Promise<ConnectionInfo | null> => {
  const params = {
    TableName: tableName,
    Key: {
      connectionId: connectionId,
    },
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    return data.Item as ConnectionInfo | null;
  } catch (error) {
    logger.error(`Failed to get connection info for connectionId: ${connectionId} error: ${error}`);
    throw new GetConnectionInfoError(error as string);
  }
};
