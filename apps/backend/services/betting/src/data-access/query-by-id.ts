import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { BetDBObject } from "../foundation/types";
import { BETS_TABLE_ARN } from "../foundation/runtime";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const queryBetById = async (betId: string): Promise<BetDBObject | undefined> => {
  const result = await docClient.send(
    new GetCommand({
      TableName: BETS_TABLE_ARN,
      Key: { id: betId },
    })
  );

  return result.Item as BetDBObject | undefined;
};
