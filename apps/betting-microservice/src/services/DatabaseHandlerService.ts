import { randomUUID } from 'crypto';
import dynamoDB from '../db/DbConnection';
import { GameOutcome, Bet } from '../models/Bet';
import { PutCommand, QueryCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { ResourceNotFoundError } from '@shared-errors/ResourceNotFoundError';

export class DatabaseHandlerService {
  private betHistoryTableName: string;

  constructor() {
    this.betHistoryTableName = process.env.AWS_BET_TABLE_NAME;
  }

  public recordBet = async (
    userId: string,
    amountBet: number,
    outcome: GameOutcome,
    outcomeAmount: number,
    gameId: string
  ): Promise<void> => {
    const betId = randomUUID();
    const timestamp = new Date().toISOString();

    const bet: Bet = {
      user_id: userId,
      bet_id: betId,
      amountBet: amountBet,
      outcome: outcome,
      outcomeAmount: outcomeAmount,
      timestamp: timestamp,
      game_id: gameId,
    };

    const params = {
      TableName: this.betHistoryTableName,
      Item: bet,
    };

    await dynamoDB.send(new PutCommand(params));
  };

  public getBetHistory = async (userId: string): Promise<Bet[]> => {
    const params = {
      TableName: this.betHistoryTableName,
      IndexName: 'user_id-timestamp-index', // Specify the GSI name
      KeyConditionExpression: 'user_id = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ScanIndexForward: false,
    };

    try {
      const result = await dynamoDB.send(new QueryCommand(params));
      return result.Items as Bet[];
    } catch (error) {
      console.error('Error fetching bet history:', error);
      throw new Error('Could not fetch bet history');
    }
  };

  public getBet = async (userId: string, betId: string): Promise<Bet> => {
    const params = {
      TableName: this.betHistoryTableName,
      Key: {
        user_id: userId,
        bet_id: betId,
      },
    };

    try {
      const result = await dynamoDB.send(new GetCommand(params));
      return result.Item as Bet;
    } catch (error) {
      console.log(error);
      throw new ResourceNotFoundError('Failed to get bet');
    }
  };
}
