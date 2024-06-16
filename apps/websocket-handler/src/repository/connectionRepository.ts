import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { ConnectionInfo } from "../models/connectionInfo";

const client = new DynamoDBClient({ region: "eu-west-2" });
const ddbDocClient = DynamoDBDocumentClient.from(client);
console.log(process.env);
const tableName = process.env.TABLE_NAME;

if (!tableName) {
  throw new Error("TABLE_NAME environment variable is not set");
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
    console.error(`Failed to save connection info: ${error}`);
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
    console.error(`Failed to delete connection info: ${error}`);
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
    console.error(`Failed to get connection info: ${error}`);
    return null;
  }
};
