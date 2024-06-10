import { InvalidInputError } from '@shared-errors/InvalidInputError';
import {
  saveBet,
  retrieveBet,
  retrieveBetHistory,
} from '../../services/BettingService';
import { Bet } from '../../models/Bet';
import axios from 'axios';
import * as remoteServiceMock from '../../remote/WalletRemote';
import * as databaseHandlerServiceMock from '../../repository/Repository';

jest.mock('../../repository/Repository', () => ({
  recordBet: jest.fn(),
  getBet: jest.fn(),
  getBetHistory: jest.fn(),
}));

jest.mock('../../remote/WalletRemote', () => ({
  createTransactionForBet: jest.fn(),
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BettingService', () => {
  beforeEach(() => {
    mockedAxios.put.mockResolvedValue({ data: 'Success' });
  });

  describe('saveBet', () => {
    it('should throw an error if required fields are missing', async () => {
      await expect(saveBet('', '', 0, 0, '')).rejects.toThrow(
        InvalidInputError
      );
    });

    it('should throw an error if bet amount is invalid', async () => {
      await expect(saveBet('userId', 'gameId', -1, 0, 'WIN')).rejects.toThrow(
        InvalidInputError
      );
    });

    it('should throw an error if outcome is invalid', async () => {
      await expect(
        saveBet('userId', 'gameId', 10, 20, 'INVALID')
      ).rejects.toThrow(InvalidInputError);
    });

    it('should create a transaction and record the bet', async () => {
      const createTransactionForBetSpy = jest
        .spyOn(remoteServiceMock, 'createTransactionForBet')
        .mockResolvedValueOnce();
      const recordBetSpy = jest
        .spyOn(databaseHandlerServiceMock, 'recordBet')
        .mockResolvedValueOnce();

      await saveBet('userId', 'gameId', 10, 20, 'WIN');

      expect(createTransactionForBetSpy).toHaveBeenCalledWith('userId', 10);
      expect(recordBetSpy).toHaveBeenCalledWith(
        'userId',
        10,
        'WIN',
        20,
        'gameId'
      );
    });
  });

  describe('getBetHistory', () => {
    it('should return the bet history for the given user', async () => {
      const getBetHistorySpy = jest
        .spyOn(databaseHandlerServiceMock, 'getBetHistory')
        .mockReturnValue(Promise.resolve([] as Bet[]));
      const userId = 'userId';

      await retrieveBetHistory(userId);

      expect(getBetHistorySpy).toHaveBeenCalledWith(userId);
    });
  });

  describe('getBet', () => {
    it('should return the bet for the given user and bet ID', async () => {
      const getBetSpy = jest
        .spyOn(databaseHandlerServiceMock, 'getBet')
        .mockReturnValue(Promise.resolve({} as Bet));
      const userId = 'userId';
      const betId = 'betId';

      await retrieveBet(userId, betId);

      expect(getBetSpy).toHaveBeenCalledWith(userId, betId);
    });
  });
});
