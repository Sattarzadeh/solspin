import DatabaseHandlerService from '../../services/DatabaseHandlerService';
import { InvalidResourceError } from '@shared-errors/InvalidResourceError';
import { ResourceNotFoundError } from '@shared-errors/ResourceNotFoundError';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Currency } from '@shared-types/shared-types';
import dynamoDb from '../../db/DbConnection';

jest.mock('../../db/DbConnection', () => ({
  send: jest.fn(),
}));

describe('DatabaseHandlerService', () => {
  let service: DatabaseHandlerService;
  const userId = 'testUser';
  const currency = Currency.SOL;
  const walletAddress = 'testAddress';
  const depositAmount = 100;
  const signature = 'testSignature';

  beforeEach(() => {
    service = new DatabaseHandlerService();
    jest.clearAllMocks();
  });

  describe('depositToDb', () => {
    it('should throw InvalidResourceError if no signature for deposit', async () => {
      const mockBets = [
        { user_id: userId, amount: 100, currency: Currency.SOL },
      ];
      (dynamoDb.send as jest.Mock).mockResolvedValue({ Items: mockBets });
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({
        Item: { user_id: userId, wallets: [{ currency, balance: 0 }] },
      });

      await expect(
        service.depositToDb(userId, currency, depositAmount, null)
      ).rejects.toThrow(InvalidResourceError);
    });

    it('should update the user wallet and record transaction', async () => {
      const user = { user_id: userId, wallets: [{ currency, balance: 0 }] };
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({ Item: user });
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({});

      await service.depositToDb(userId, currency, depositAmount, signature);

      expect(dynamoDb.send).toHaveBeenCalledWith(expect.any(PutCommand));
      expect(dynamoDb.send).toHaveBeenCalledWith(expect.any(GetCommand));
    });
  });

  describe('withdrawFromDb', () => {
    it('should throw ResourceNotFoundError if wallet not found', async () => {
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({
        Item: { user_id: userId, wallets: [] },
      });

      await expect(
        service.withdrawFromDb(userId, currency, depositAmount, signature)
      ).rejects.toThrow(ResourceNotFoundError);
    });

    it('should throw InvalidResourceError if insufficient balance', async () => {
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({
        Item: { user_id: userId, wallets: [{ currency, balance: 50 }] },
      });

      await expect(
        service.withdrawFromDb(userId, currency, depositAmount, signature)
      ).rejects.toThrow(InvalidResourceError);
    });

    it('should update the user wallet and record transaction', async () => {
      const user = { user_id: userId, wallets: [{ currency, balance: 200 }] };
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({ Item: user });
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({});

      await service.withdrawFromDb(userId, currency, depositAmount, signature);

      expect(dynamoDb.send).toHaveBeenCalledWith(expect.any(PutCommand));
      expect(dynamoDb.send).toHaveBeenCalledWith(expect.any(GetCommand));
    });
  });

  describe('getBalance', () => {
    it('should return the balance of the wallet', async () => {
      const wallet = { currency, balance: 150 };
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({
        Item: { user_id: userId, wallets: [wallet] },
      });

      const balance = await service.getBalance(userId, currency);
      expect(balance).toBe(150);
    });
  });

  describe('getWagerRequirement', () => {
    it('should return the wager requirement of the wallet', async () => {
      const wallet = { currency, wagerRequirement: 300 };
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({
        Item: { user_id: userId, wallets: [wallet] },
      });

      const wagerRequirement = await service.getWagerRequirement(
        userId,
        currency
      );
      expect(wagerRequirement).toBe(300);
    });
  });

  describe('createWallet', () => {
    it('should create a new wallet if user exists', async () => {
      const user = { user_id: userId, wallets: [] };
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({ Item: user });
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({});

      await service.createWallet(userId, currency, walletAddress);

      expect(dynamoDb.send).toHaveBeenCalledWith(expect.any(PutCommand));
    });

    it('should create a new user and wallet if user does not exist', async () => {
      (dynamoDb.send as jest.Mock).mockRejectedValueOnce(
        new ResourceNotFoundError('User not found')
      );
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({});
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({});

      await service.createWallet(userId, currency, walletAddress);

      expect(dynamoDb.send).toHaveBeenCalledWith(expect.any(PutCommand));
      expect(dynamoDb.send).toHaveBeenCalledWith(expect.any(GetCommand));
    });

    it('should throw InvalidResourceError if wallet already exists', async () => {
      const user = { user_id: userId, wallets: [{ currency, balance: 0 }] };
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({ Item: user });

      await expect(
        service.createWallet(userId, currency, walletAddress)
      ).rejects.toThrow(InvalidResourceError);
    });
  });
});
