import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { GameOutcome } from "@solspin/types";
import { BetDBObject } from "../foundation/types";
import { BETS_TABLE_ARN } from "../foundation/runtime";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const queryBetsByUserId = async (
  userId: string,
  gameOutcome?: GameOutcome,
  outcomeAmount?: number,
  betAmount?: number
): Promise<BetDBObject[]> => {
  const filterExpressions: string[] = [];
  const expressionAttributeValues: Record<string, any> = {
    ":userId": userId,
  };

  if (gameOutcome) {
    filterExpressions.push("outcome = :outcome");
    expressionAttributeValues[":outcome"] = gameOutcome;
  }

  if (outcomeAmount) {
    filterExpressions.push("outcomeAmount = :outcomeAmount");
    expressionAttributeValues[":outcomeAmount"] = outcomeAmount;
  }

  if (betAmount) {
    filterExpressions.push("amountBet = :betAmount");
    expressionAttributeValues[":betAmount"] = betAmount;
  }

  const filterExpression = filterExpressions.join(" AND ");

  const result = await docClient.send(
    new QueryCommand({
      TableName: BETS_TABLE_ARN,
      IndexName: "byUser",
      KeyConditionExpression: "userId = :userId",
      FilterExpression: filterExpression || undefined,
      ExpressionAttributeValues: expressionAttributeValues,
    })
  );

  return result.Items as BetDBObject[];
};
