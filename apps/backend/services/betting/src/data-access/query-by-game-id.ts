import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { GameOutcome } from "@solpin/types";
import { BetDBObject } from "../foundation/types";
import { BETS_TABLE_ARN } from "../foundation/runtime";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const queryBetsByGameId = async (
  gameId: string,
  gameOutcome?: GameOutcome,
  outcomeAmount?: number,
  betAmount?: number
): Promise<BetDBObject[]> => {
  const filterExpressions: string[] = [];
  const expressionAttributeValues: Record<string, any> = {
    ":gameId": gameId,
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
      IndexName: "byGame",
      KeyConditionExpression: "gameId = :gameId",
      FilterExpression: filterExpression || undefined,
      ExpressionAttributeValues: expressionAttributeValues,
    })
  );

  return result.Items as BetDBObject[];
};
