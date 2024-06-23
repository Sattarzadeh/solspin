import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { WalletsDBObject } from "../foundation/types";
import { WALLETS_TABLE_ARN } from "../foundation/runtime";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const queryWalletById = async (userId: string): Promise<WalletsDBObject | undefined> => {
  const result = await docClient.send(
    new GetCommand({
      TableName: WALLETS_TABLE_ARN,
      Key: { userId: userId },
    })
  );

  return result.Item as WalletsDBObject | undefined;
};
