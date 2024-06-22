import { randomUUID } from "crypto";
import dynamoDB from "../db/DbConnection";
import { Bet, GameOutcome } from "@solspin/betting-types";
import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ResourceNotFoundError } from "@solspin/errors";

const BET_TABLE_NAME = process.env.AWS_BETS_TABLE_NAME;

export const recordBet = async (
  userId: string,
  amountBet: number,
  outcome: GameOutcome,
  outcomeAmount: number,
  gameId: string
): Promise<void> => {
  const betId = randomUUID();
  const timestamp = new Date().toISOString();

  const bet: Bet = {
    userId: userId,
    betId: betId,
    amountBet: amountBet,
    outcome: outcome,
    outcomeAmount: outcomeAmount,
    timestamp: timestamp,
    gameId: gameId,
  };
  console.log("bet:", bet, "params:", BET_TABLE_NAME);
  const params = {
    TableName: BET_TABLE_NAME,
    Item: bet,
  };

  await dynamoDB.send(new PutCommand(params));
};

export const getBetHistory = async (userId: string): Promise<Bet[]> => {
  const params = {
    TableName: BET_TABLE_NAME,
    IndexName: "bet_history", // Specify the GSI name
    KeyConditionExpression: "user_id = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
    ScanIndexForward: false,
  };

  try {
    const result = await dynamoDB.send(new QueryCommand(params));
    return result.Items as Bet[];
  } catch (error) {
    console.error("Error fetching bet history:", error);
    throw new Error("Could not fetch bet history");
  }
};

export const getBet = async (userId: string, betId: string): Promise<Bet> => {
  const params = {
    TableName: BET_TABLE_NAME,
    Key: {
      userId: userId,
      betId: betId,
    },
  };
  const result = await dynamoDB.send(new GetCommand(params));

  if (!result.Item || result.Item.length === 0) {
    throw new ResourceNotFoundError("Bet was not found");
  }

  return result.Item as Bet;
};
