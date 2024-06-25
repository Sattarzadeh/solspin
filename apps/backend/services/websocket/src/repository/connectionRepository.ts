import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { ConnectionInfo } from "../foundation/connectionInfo";
import {
  EnvironmentVariableError,
  SaveConnectionInfoError,
  DeleteConnectionInfoError,
  GetConnectionInfoError,
} from "@solspin/errors";

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

  await ddbDocClient.send(new PutCommand(params));
};

export const deleteConnectionInfo = async (connectionId: string): Promise<void> => {
  const params = {
    TableName: tableName,
    Key: {
      connectionId: connectionId,
    },
  };

  await ddbDocClient.send(new DeleteCommand(params));
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

  const data = await ddbDocClient.send(new GetCommand(params));
  return data.Item as ConnectionInfo | null;
};
