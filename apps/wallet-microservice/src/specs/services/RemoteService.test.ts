import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import RemoteService from '../../remote/TreasuryRemote';
import {
  Currency,
  DepositTransactionResponse,
} from '@shared-types/shared-types';

describe('RemoteService', () => {
  let mock: MockAdapter;
  let service: RemoteService;
  const baseURL = 'http://localhost:3000';

  beforeEach(() => {
    mock = new MockAdapter(axios);
    service = new RemoteService(baseURL);
  });

  afterEach(() => {
    mock.reset();
  });

  describe('broadcastWithdrawalTransaction', () => {
    it('should return a signature on successful withdrawal', async () => {
      const userId = 'testUser';
      const amount = 100;
      const currency = 'USD' as Currency;
      const walletAddress = 'testAddress';
      const signature = 'testSignature';

      mock.onPost(`/withdraw/${userId}`).reply(200, { signature });

      const result = await service.broadcastWithdrawalTransaction(
        userId,
        amount,
        currency,
        walletAddress
      );
      expect(result).toBe(signature);
    });

    it('should throw an error on failed withdrawal', async () => {
      const userId = 'testUser';
      const amount = 100;
      const currency = 'USD' as Currency;
      const walletAddress = 'testAddress';

      mock.onPost(`/withdraw/${userId}`).reply(400, { message: 'Bad Request' });

      await expect(
        service.broadcastWithdrawalTransaction(
          userId,
          amount,
          currency,
          walletAddress
        )
      ).rejects.toThrow();
    });
  });

  describe('broadcastDepositTransaction', () => {
    it('should return response data on successful deposit', async () => {
      const userId = 'testUser';
      const walletAddress = 'testAddress';
      const currency = 'USD' as Currency;
      const signedTransaction = 'signedTransaction';
      const responseData: DepositTransactionResponse = {
        message: 'Deposit successful',
        depositAmount: 100,
        transactionId: 'transactionId',
      };

      mock.onPost(`/deposit/${userId}`).reply(200, responseData);

      const result = await service.broadcastDepositTransaction(
        userId,
        walletAddress,
        currency,
        signedTransaction
      );
      expect(result).toEqual(responseData);
    });

    it('should throw an error on failed deposit', async () => {
      const userId = 'testUser';
      const walletAddress = 'testAddress';
      const currency = 'USD' as Currency;
      const signedTransaction = 'signedTransaction';

      mock.onPost(`/deposit/${userId}`).reply(400, { message: 'Bad Request' });

      await expect(
        service.broadcastDepositTransaction(
          userId,
          walletAddress,
          currency,
          signedTransaction
        )
      ).rejects.toThrow();
    });
  });

  describe('handleError', () => {
    it('should log axios errors correctly', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = {
        isAxiosError: true,
        response: { status: 400, data: 'Bad Request' },
      };

      service['handleError'](error);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error response:',
        error.response
      );
      consoleSpy.mockRestore();
    });

    it('should log non-axios errors correctly', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Unexpected error');

      service['handleError'](error);

      expect(consoleSpy).toHaveBeenCalledWith('Unexpected error:', error);
      consoleSpy.mockRestore();
    });
  });
});
