import { BettingService } from '../../services/BettingService';
import { RemoteService } from '../../services/RemoteService';
import { DatabaseHandlerService } from '../../services/DatabaseHandlerService';
import { InvalidInputError } from '@shared-errors/InvalidInputError';
import { Currency } from '@shared-types/shared-types';
import MockAdapter from 'axios-mock-adapter';
import { Bet } from '../../models/Bet';

describe('BettingService', () => {
  let bettingService: BettingService;
  let remoteServiceMock: RemoteService;
  let databaseHandlerServiceMock: DatabaseHandlerService;

  const baseUrl = 'http://localhost:3000/wallets';

  beforeEach(() => {
    remoteServiceMock = new RemoteService(baseUrl);
    databaseHandlerServiceMock = new DatabaseHandlerService();
    bettingService = new BettingService(
      remoteServiceMock,
      databaseHandlerServiceMock
    );
    const mockAxios = new MockAdapter((remoteServiceMock as any).client);
    mockAxios.onPut(`${baseUrl}/balance/update/userId`).reply(200);
  });

  describe('recordBet', () => {
    it('should throw an error if required fields are missing', async () => {
      await expect(
        bettingService.recordBet('', '', 0, 0, '', Currency.SOL)
      ).rejects.toThrow(InvalidInputError);
    });

    it('should throw an error if bet amount is invalid', async () => {
      await expect(
        bettingService.recordBet('userId', 'gameId', -1, 0, 'WIN', Currency.SOL)
      ).rejects.toThrow(InvalidInputError);
    });

    it('should throw an error if outcome is invalid', async () => {
      await expect(
        bettingService.recordBet(
          'userId',
          'gameId',
          10,
          20,
          'INVALID',
          Currency.SOL
        )
      ).rejects.toThrow(InvalidInputError);
    });

    it('should create a transaction and record the bet', async () => {
      const createTransactionForBetSpy = jest.spyOn(
        remoteServiceMock,
        'createTransactionForBet'
      );
      const recordBetSpy = jest.spyOn(databaseHandlerServiceMock, 'recordBet');

      await bettingService.recordBet(
        'userId',
        'gameId',
        10,
        20,
        'WIN',
        Currency.SOL
      );

      expect(createTransactionForBetSpy).toHaveBeenCalledWith(
        'userId',
        10,
        Currency.SOL
      );
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
      const getBetHistorySpy = jest.spyOn(
        databaseHandlerServiceMock,
        'getBetHistory'
      );
      const userId = 'userId';

      await bettingService.getBetHistory(userId);

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

      await bettingService.getBet(userId, betId);

      expect(getBetSpy).toHaveBeenCalledWith(userId, betId);
    });
  });
});
