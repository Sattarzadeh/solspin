import { randomUUID } from "crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { GameOutcome } from "@solpin/types";
import { BetDBObject } from "../foundation/types";
import { BETS_TABLE_ARN } from "../foundation/runtime";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const recordBet = async (
  userId: string,
  gameId: string,
  amountBet: number,
  outcome: GameOutcome,
  outcomeAmount: number
): Promise<void> => {
  const id = randomUUID();
  const createdAt = new Date().toISOString();

  const bet: BetDBObject = {
    id,
    userId,
    gameId,
    amountBet,
    outcome,
    outcomeAmount,
    createdAt,
  };

  await docClient.send(
    new PutCommand({
      TableName: BETS_TABLE_ARN,
      Item: bet,
    })
  );
};
