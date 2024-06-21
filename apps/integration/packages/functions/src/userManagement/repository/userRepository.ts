import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  GetCommand,
  UpdateCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  EnvironmentVariableError,
  SaveUserError,
  GetUserError,
  DeleteUserError,
  UpdateUserError,
} from "@solspin/errors";
import logger from "@solspin/logger";
import { User } from "@solspin/user-management-types";

const client = new DynamoDBClient({ region: "eu-west-2" });
const ddbDocClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.TABLE_NAME;
const walletAddressIndexName = "walletAddressIndex";

if (!tableName) {
  throw new EnvironmentVariableError("TABLE_NAME");
}

const walletAddressExists = async (walletAddress: string): Promise<boolean> => {
  const params = {
    TableName: tableName,
    IndexName: walletAddressIndexName,
    KeyConditionExpression: "walletAddress = :walletAddress",
    ExpressionAttributeValues: {
      ":walletAddress": walletAddress,
    },
  };

  const result = await ddbDocClient.send(new QueryCommand(params));
  return result.Items && result.Items.length > 0;
};

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

export const createUser = async (user: User): Promise<void> => {
  const exists = await walletAddressExists(user.walletAddress);

  if (exists) {
    throw new Error(`User with walletAddress ${user.walletAddress} already exists.`);
  }

  const params = {
    TableName: tableName,
    Item: user,
    ConditionExpression: "attribute_not_exists(userId)", // Ensure userId is unique
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      throw new Error(`User with userId ${user.userId} already exists.`);
    }
    throw new Error(`Failed to create user: ${error.message}`);
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
