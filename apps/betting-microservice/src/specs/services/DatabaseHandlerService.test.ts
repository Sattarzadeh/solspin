import { randomUUID } from 'crypto';
import { recordBet, getBet, getBetHistory } from '../../repository/Repository';
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
  beforeEach(() => {
    process.env.AWS_BET_TABLE_NAME = 'bets';
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
        userId: 'userId',
        betId: 'mock-bet-id',
        amountBet: 10,
        outcome: 'WIN' as GameOutcome,
        outcomeAmount: 20,
        timestamp: mockDate,
        gameId: 'gameId',
      };

      await recordBet('userId', 10, 'WIN' as GameOutcome, 20, 'gameId');

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
          userId: 'userId',
          betId: 'betId1',
          amountBet: 10,
          outcome: 'WIN' as GameOutcome,
          outcomeAmount: 20,
          timestamp: new Date().toISOString(),
          gameId: 'gameId',
        },
      ];

      (dynamoDB.send as jest.Mock).mockResolvedValue({ Items: mockBets });

      const result = await getBetHistory('userId');

      expect(dynamoDB.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: 'bets',
            IndexName: 'bet_history',
            KeyConditionExpression: 'userId = :userId',
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

      await expect(getBetHistory('userId')).rejects.toThrow(
        'Could not fetch bet history'
      );
    });
  });

  describe('getBet', () => {
    it('should fetch a specific bet successfully', async () => {
      const mockBet: Bet = {
        userId: 'userId',
        betId: 'betId',
        amountBet: 10,
        outcome: 'WIN' as GameOutcome,
        outcomeAmount: 20,
        timestamp: new Date().toISOString(),
        gameId: 'gameId',
      };

      (dynamoDB.send as jest.Mock).mockResolvedValue({ Item: mockBet });

      const result = await getBet('userId', 'betId');

      expect(dynamoDB.send).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: 'bets',
            Key: {
              userId: 'userId',
              betId: 'betId',
            },
          }),
        })
      );
      expect(result).toEqual(mockBet);
    });

    it('should throw ResourceNotFoundError if bet is not found', async () => {
      (dynamoDB.send as jest.Mock).mockResolvedValue({});

      await expect(getBet('userId', 'betId')).rejects.toThrow(
        ResourceNotFoundError
      );
    });

    it('should throw ResourceNotFoundError if fetching bet fails', async () => {
      (dynamoDB.send as jest.Mock).mockRejectedValue(
        new ResourceNotFoundError('Bet was not found')
      );

      await expect(getBet('userId', 'betId')).rejects.toThrow(
        ResourceNotFoundError
      );
    });
  });
});
