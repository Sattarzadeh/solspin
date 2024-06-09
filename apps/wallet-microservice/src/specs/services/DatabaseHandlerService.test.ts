import { InvalidResourceError } from '@shared-errors/InvalidResourceError';
import { ResourceNotFoundError } from '@shared-errors/ResourceNotFoundError';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import dynamoDb from '../../db/DbConnection';
import {
  depositToDb,
  withdrawFromDb,
  getBalance,
  getWagerRequirement,
  addWallet,
} from '@wallet-microservice/repository/Repository';

jest.mock('../../db/DbConnection', () => ({
  send: jest.fn(),
}));

describe('DatabaseHandlerService', () => {
  const userId = 'testUser';
  const walletAddress = 'testAddress';
  const depositAmount = 100;
  const signature = 'testSignature';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('depositToDb', () => {
    const wallet = {
      userId: userId,
      balance: 0,
      wagerRequirement: 0,
      address: walletAddress,
      lockedAt: '0',
    };

    it('should throw InvalidResourceError if no signature for deposit', async () => {
      const mockBets = [{ user_id: userId, amount: 100 }];
      (dynamoDb.send as jest.Mock).mockResolvedValue({ Items: mockBets });
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({
        Item: wallet,
      });

      await expect(depositToDb(wallet, depositAmount, null)).rejects.toThrow(
        InvalidResourceError
      );
    });

    it('should update the user wallet and record transaction', async () => {
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({ Item: wallet });
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({});

      await depositToDb(wallet, depositAmount, signature);

      expect(dynamoDb.send).toHaveBeenCalledWith(expect.any(PutCommand));
      expect(dynamoDb.send).toHaveBeenCalledWith(expect.any(GetCommand));
    });
  });

  describe('withdrawFromDb', () => {
    const wallet = {
      userId: userId,
      balance: 50,
      wagerRequirement: 0,
      address: walletAddress,
      lockedAt: '0',
    };

    it('should throw InvalidResourceError if insufficient balance', async () => {
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({
        Item: wallet,
      });

      await expect(
        withdrawFromDb(wallet, depositAmount, signature)
      ).rejects.toThrow(InvalidResourceError);
    });

    it('should update the user wallet and record transaction', async () => {
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({ Item: wallet });
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({});

      await withdrawFromDb(wallet, depositAmount, signature);

      expect(dynamoDb.send).toHaveBeenCalledWith(expect.any(PutCommand));
      expect(dynamoDb.send).toHaveBeenCalledWith(expect.any(GetCommand));
    });
  });

  describe('getBalance', () => {
    const wallet = {
      userId: userId,
      balance: 150,
      wagerRequirement: 0,
      address: walletAddress,
      lockedAt: '0',
    };

    it('should return the balance of the wallet', async () => {
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({
        Item: { user_id: userId, wallets: [wallet] },
      });

      const balance = await getBalance(userId);
      expect(balance).toBe(150);
    });
  });

  describe('getWagerRequirement', () => {
    const wallet = {
      userId: userId,
      balance: 0,
      wagerRequirement: 300,
      address: walletAddress,
      lockedAt: '0',
    };
    it('should return the wager requirement of the wallet', async () => {
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({
        Item: { user_id: userId, wallets: [wallet] },
      });

      const wagerRequirement = await getWagerRequirement(userId);
      expect(wagerRequirement).toBe(300);
    });
  });

  describe('createWallet', () => {
    const wallet = {
      userId: userId,
      balance: 0,
      wagerRequirement: 0,
      address: walletAddress,
      lockedAt: '0',
    };
    it('should create a new wallet if user exists', async () => {
      const user = { user_id: userId, wallets: [] };
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({ Item: user });
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({});

      await addWallet(userId, walletAddress);

      expect(dynamoDb.send).toHaveBeenCalledWith(expect.any(PutCommand));
    });

    it('should create a new user and wallet if user does not exist', async () => {
      (dynamoDb.send as jest.Mock).mockRejectedValueOnce(
        new ResourceNotFoundError('User not found')
      );
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({});
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({});

      await addWallet(userId, walletAddress);

      expect(dynamoDb.send).toHaveBeenCalledWith(expect.any(PutCommand));
      expect(dynamoDb.send).toHaveBeenCalledWith(expect.any(PutCommand));
    });

    it('should throw InvalidResourceError if wallet already exists', async () => {
      (dynamoDb.send as jest.Mock).mockResolvedValueOnce({ Item: wallet });

      await expect(addWallet(userId, walletAddress)).rejects.toThrow(
        InvalidResourceError
      );
    });
  });
});
