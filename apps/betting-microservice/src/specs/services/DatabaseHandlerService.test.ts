import { randomUUID } from 'crypto';
import { DatabaseHandlerService } from '../../services/DatabaseHandlerService';
import dynamoDB from '../../db/DbConnection';
import { GameOutcome, Bet } from '../../models/Bet';
import { ResourceNotFoundError } from '@shared-errors/ResourceNotFoundError';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(),
}));

jest.mock('../../db/DbConnection', () => ({
  send: jest.fn(),
}));

describe('DatabaseHandlerService', () => {
  let databaseHandlerService: DatabaseHandlerService;

  beforeEach(() => {
    process.env.AWS_BET_TABLE_NAME = 'bets';
    databaseHandlerService = new DatabaseHandlerService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('recordBet', () => {
    it('should record a bet successfully', async () => {
      (randomUUID as jest.Mock).mockReturnValue('mock-bet-id');
      const mockDate = '2024-05-26T13:37:11.636Z';
      jest
        .spyOn(global.Date.prototype, 'toISOString')
        .mockReturnValue(mockDate);

      const bet: Bet = {
        user_id: 'userId',
        bet_id: 'mock-bet-id',
        amountBet: 10,
        outcome: 'WIN' as GameOutcome,
        outcomeAmount: 20,
        timestamp: mockDate,
        game_id: 'gameId',
      };

      await databaseHandlerService.recordBet(
        'userId',
        10,
        'WIN' as GameOutcome,
        20,
        'gameId'
      );

      expect(dynamoDB.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: 'bets',
            Item: expect.objectContaining(bet),
          }),
        })
      );
      expect(dynamoDB.send).toHaveBeenCalledTimes(1);
    });
  });

  describe('getBetHistory', () => {
    it('should fetch bet history successfully', async () => {
      const mockBets: Bet[] = [
        {
          user_id: 'userId',
          bet_id: 'betId1',
          amountBet: 10,
          outcome: 'WIN' as GameOutcome,
          outcomeAmount: 20,
          timestamp: new Date().toISOString(),
          game_id: 'gameId',
        },
      ];

      (dynamoDB.send as jest.Mock).mockResolvedValue({ Items: mockBets });

      const result = await databaseHandlerService.getBetHistory('userId');

      expect(dynamoDB.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: 'bets',
            IndexName: 'bet_history',
            KeyConditionExpression: 'user_id = :userId',
            ExpressionAttributeValues: {
              ':userId': 'userId',
            },
            ScanIndexForward: false,
          }),
        })
      );
      expect(result).toEqual(mockBets);
    });

    it('should throw an error if fetching bet history fails', async () => {
      (dynamoDB.send as jest.Mock).mockRejectedValue(
        new ResourceNotFoundError('Bets were not found')
      );

      await expect(
        databaseHandlerService.getBetHistory('userId')
      ).rejects.toThrow('Could not fetch bet history');
    });
  });

  describe('getBet', () => {
    it('should fetch a specific bet successfully', async () => {
      const mockBet: Bet = {
        user_id: 'userId',
        bet_id: 'betId',
        amountBet: 10,
        outcome: 'WIN' as GameOutcome,
        outcomeAmount: 20,
        timestamp: new Date().toISOString(),
        game_id: 'gameId',
      };

      (dynamoDB.send as jest.Mock).mockResolvedValue({ Item: mockBet });

      const result = await databaseHandlerService.getBet('userId', 'betId');

      expect(dynamoDB.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: 'bets',
            Key: {
              user_id: 'userId',
              bet_id: 'betId',
            },
          }),
        })
      );
      expect(result).toEqual(mockBet);
    });

    it('should throw ResourceNotFoundError if bet is not found', async () => {
      (dynamoDB.send as jest.Mock).mockResolvedValue({});

      await expect(
        databaseHandlerService.getBet('userId', 'betId')
      ).rejects.toThrow(ResourceNotFoundError);
    });

    it('should throw ResourceNotFoundError if fetching bet fails', async () => {
      (dynamoDB.send as jest.Mock).mockRejectedValue(
        new ResourceNotFoundError('Bet was not found')
      );

      await expect(
        databaseHandlerService.getBet('userId', 'betId')
      ).rejects.toThrow(ResourceNotFoundError);
    });
  });
});
