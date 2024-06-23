import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { WalletsDBObject } from "../foundation/types";
import { WALLETS_TABLE_ARN } from "../foundation/runtime";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const createWallet = async (
  userId: string,
  walletAddress: string | undefined
): Promise<WalletsDBObject> => {
  const createdAt = new Date().toISOString();

  const wallet: WalletsDBObject = {
    userId: userId,
    balance: 0,
    wagerRequirement: 0,
    walletAddress: walletAddress || "",
    createdAt: createdAt,
    lockedAt: "0",
  };

  await docClient.send(
    new PutCommand({
      TableName: WALLETS_TABLE_ARN,
      Item: wallet,
    })
  );

  return wallet;
};
