import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  EnvironmentVariableError,
  SaveUserError,
  GetUserError,
  DeleteUserError,
  UpdateUserError,
} from "@solspin/errors";
import logger from "@solspin/logger";

const client = new DynamoDBClient({ region: "eu-west-2" });
const ddbDocClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.TABLE_NAME;

if (!tableName) {
  throw new EnvironmentVariableError("TABLE_NAME");
}

export const buildUpdateExpression = (updateFields: Record<string, any>) => {
  let UpdateExpression = "set";
  const ExpressionAttributeNames: Record<string, string> = {};
  const ExpressionAttributeValues: Record<string, any> = {};

  for (const [key, value] of Object.entries(updateFields)) {
    UpdateExpression += ` #${key} = :${key},`;
    ExpressionAttributeNames[`#${key}`] = key;
    ExpressionAttributeValues[`:${key}`] = value;
  }

  UpdateExpression = UpdateExpression.slice(0, -1);

  return {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };
};

export const createUser = async (user: Record<string, any>): Promise<void> => {
  const params = {
    TableName: tableName,
    Item: user,
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
  } catch (error) {
    logger.error(`Failed to create user: ${(error as Error).message}`);
    throw new SaveUserError((error as Error).message);
  }
};

export const updateUser = async (
  userId: string,
  updateFields: Record<string, any>
): Promise<any> => {
  const key = { userId };

  const { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } =
    buildUpdateExpression(updateFields);

  const updateParams = {
    TableName: tableName,
    Key: key,
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW" as const,
  };

  try {
    const result = await ddbDocClient.send(new UpdateCommand(updateParams));
    return result.Attributes;
  } catch (error) {
    logger.error(
      `Failed to update user data for userId: ${userId} error: ${(error as Error).message}`
    );
    throw new UpdateUserError((error as Error).message);
  }
};

export const getUser = async (userId: string): Promise<any> => {
  const params = {
    TableName: tableName,
    Key: { userId },
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    return data.Item;
  } catch (error) {
    logger.error(
      `Failed to get user data for userId: ${userId} error: ${(error as Error).message}`
    );
    throw new GetUserError((error as Error).message);
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  const params = {
    TableName: tableName,
    Key: { userId },
  };

  try {
    await ddbDocClient.send(new DeleteCommand(params));
  } catch (error) {
    logger.error(
      `Failed to delete user data for userId: ${userId} error: ${(error as Error).message}`
    );
    throw new DeleteUserError((error as Error).message);
  }
};
