import { DepositTransactionResponse, Wallet } from '@shared-types/shared-types';
import { InvalidInputError } from '@shared-errors/InvalidInputError';
import { InsufficientBalanceError } from '@shared-errors/InsufficientBalanceError';
import { ResourceNotFoundError } from '@shared-errors/ResourceNotFoundError';
import * as Repository from '../../repository/Repository';
import * as TreasuryRemote from '../../remote/TreasuryRemote';
import {
  handleDeposit,
  handleWithdrawal,
  createWallet,
  updateUserBalance,
} from '../../services/TransactionService';

// Mock the module
jest.mock('../../repository/Repository', () => ({
  depositToDb: jest.fn(),
  withdrawFromDb: jest.fn(),
  getUser: jest.fn(),
  lockWallet: jest.fn(),
  unlockWallet: jest.fn(),
  getBalance: jest.fn(),
  createWallet: jest.fn(),
}));

jest.mock('../../remote/TreasuryRemote', () => ({
  broadcastDepositTransaction: jest.fn(),
  broadcastWithdrawalTransaction: jest.fn(),
}));

const depositToDb = Repository.depositToDb as jest.Mock;
const withdrawFromDb = Repository.withdrawFromDb as jest.Mock;
const getWallet = Repository.getWallet as jest.Mock;
const lockWallet = Repository.lockWallet as jest.Mock;
const unlockWallet = Repository.unlockWallet as jest.Mock;
const getBalance = Repository.getBalance as jest.Mock;
const addWallet = Repository.addWallet as jest.Mock;
const broadcastDepositTransaction =
  TreasuryRemote.broadcastDepositTransaction as jest.Mock;
const broadcastWithdrawalTransaction =
  TreasuryRemote.broadcastWithdrawalTransaction as jest.Mock;

jest.mock('../../services/RemoteService');

describe('TransactionService', () => {
  describe('handleDeposit', () => {
    it('should handle SOL deposit successfully', async () => {
      const userId = 'testUser';
      const walletAddress = 'testAddress';
      const base64Transaction = 'testTransaction';
      const depositResponse: DepositTransactionResponse = {
        message: 'Deposit successful',
        depositAmount: 100,
        transactionId: 'transactionId',
      };

      broadcastDepositTransaction.mockResolvedValue(depositResponse);
      depositToDb.mockResolvedValue(undefined);

      await handleDeposit(userId, walletAddress, base64Transaction);

      expect(broadcastDepositTransaction).toHaveBeenCalledWith(
        userId,
        walletAddress,
        base64Transaction
      );
      expect(depositToDb).toHaveBeenCalledWith(
        userId,
        depositResponse.depositAmount,
        depositResponse.transactionId
      );
    });
  });

  describe('handleWithdrawal', () => {
    const userId = 'testUser';
    const walletAddress = 'testAddress';
    const amount = 1;

    it('should handle SOL withdrawal successfully', async () => {
      const wallet: Wallet = {
        userId,
        balance: 100,
        wagerRequirement: 0,
        address: walletAddress,
        lockedAt: '0',
      };
      const signature = 'testSignature';

      getWallet.mockResolvedValue(wallet);
      broadcastWithdrawalTransaction.mockResolvedValue(signature);
      withdrawFromDb.mockResolvedValue(undefined);
      lockWallet.mockResolvedValue(undefined);
      unlockWallet.mockResolvedValue(undefined);

      await handleWithdrawal(userId, walletAddress, amount);

      expect(getWallet).toHaveBeenCalledWith(userId);
      expect(broadcastWithdrawalTransaction).toHaveBeenCalledWith(
        userId,
        amount,
        walletAddress
      );
      expect(withdrawFromDb).toHaveBeenCalledWith(userId, amount, signature);
      expect(lockWallet).toHaveBeenCalledWith(wallet.userId);
      expect(unlockWallet).toHaveBeenCalledWith(wallet.userId);
    });

    it('should throw InvalidInputError for amount below minimum withdrawal', async () => {
      await expect(
        handleWithdrawal(userId, walletAddress, 0.05)
      ).rejects.toThrow(InvalidInputError);
    });

    it('should throw ResourceNotFoundError if wallet not found', async () => {
      getWallet.mockResolvedValue({} as Wallet);

      await expect(
        handleWithdrawal(userId, walletAddress, amount)
      ).rejects.toThrow(ResourceNotFoundError);
    });

    it('should throw InsufficientBalanceError if balance is insufficient', async () => {
      const wallet: Wallet = {
        userId: userId,
        balance: 100,
        wagerRequirement: 0,
        address: walletAddress,
        lockedAt: '0',
      };
      getWallet.mockResolvedValue(wallet);

      await expect(
        handleWithdrawal(userId, walletAddress, amount)
      ).rejects.toThrow(InsufficientBalanceError);
    });

    it('should throw InvalidInputError if there is an active wager requirement', async () => {
      const wallet: Wallet = {
        userId: userId,
        balance: 100,
        wagerRequirement: 0,
        address: walletAddress,
        lockedAt: '0',
      };
      getWallet.mockResolvedValue(wallet);

      await expect(
        handleWithdrawal(userId, walletAddress, amount)
      ).rejects.toThrow(InvalidInputError);
    });
  });

  describe('getWallet', () => {
    it('should return user wallet', async () => {
      const userId = 'testUser';
      const wallet: Wallet = {
        userId: userId,
        balance: 100,
        wagerRequirement: 0,
        address: 'testAddress',
        lockedAt: '0',
      };
      getWallet.mockResolvedValue(wallet);

      const result = await getWallet(userId);
      expect(result).toEqual(wallet);
    });

    it('should throw ResourceNotFoundError if wallet not found', async () => {
      const userId = 'testUser';
      getWallet.mockResolvedValue({} as Wallet);

      await expect(getWallet(userId)).rejects.toThrow(ResourceNotFoundError);
    });
  });

  describe('getBalance', () => {
    it('should return user balance', async () => {
      const userId = 'testUser';

      getBalance.mockResolvedValue(100);

      const result = await getBalance(userId);
      expect(result).toBe(100);
    });
  });

  describe('createWallet', () => {
    it('should create a new wallet for the user', async () => {
      const userId = 'testUser';
      const walletAddress = 'testAddress';

      addWallet.mockResolvedValue(undefined);

      await createWallet(userId, walletAddress);

      expect(addWallet).toHaveBeenCalledWith(userId, walletAddress);
    });
  });

  describe('updateUserBalance', () => {
    it('should update the user balance', async () => {
      const userId = 'testUser';
      const amount = 100;

      depositToDb.mockResolvedValue(undefined);

      await updateUserBalance(userId, amount);

      expect(depositToDb).toHaveBeenCalledWith(userId, amount, null, false);
    });
  });
});
