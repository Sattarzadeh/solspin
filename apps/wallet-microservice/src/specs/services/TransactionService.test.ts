import RemoteService from '../../remote/TreasuryRemote';
import { DepositTransactionResponse, Wallet } from '@shared-types/shared-types';
import { InvalidInputError } from '@shared-errors/InvalidInputError';
import { InsufficientBalanceError } from '@shared-errors/InsufficientBalanceError';
import { ResourceNotFoundError } from '@shared-errors/ResourceNotFoundError';

jest.mock('../../services/DatabaseHandlerService', () => {
  return jest.fn().mockImplementation(() => {
    return {
      depositToDb: jest.fn(),
      withdrawFromDb: jest.fn(),
      getUser: jest.fn(),
      lockWallet: jest.fn(),
      unlockWallet: jest.fn(),
      getBalance: jest.fn(),
      createWallet: jest.fn(),
    };
  });
});

jest.mock('../../services/RemoteService');

describe('TransactionService', () => {
  let mockRemoteService: jest.Mocked<RemoteService>;
  let mockDatabaseHandlerService: jest.Mocked<DatabaseHandlerService>;

  beforeEach(() => {
    mockRemoteService = new RemoteService(
      'http://localhost:3000'
    ) as jest.Mocked<RemoteService>;
    mockDatabaseHandlerService =
      new DatabaseHandlerService() as jest.Mocked<DatabaseHandlerService>;
    transactionService = new TransactionService(
      mockRemoteService,
      mockDatabaseHandlerService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

      mockRemoteService.broadcastDepositTransaction.mockResolvedValue(
        depositResponse
      );
      mockDatabaseHandlerService.depositToDb.mockResolvedValue(undefined);

      await transactionService.handleDeposit(
        userId,
        walletAddress,
        base64Transaction
      );

      expect(
        mockRemoteService.broadcastDepositTransaction
      ).toHaveBeenCalledWith(userId, walletAddress, base64Transaction);
      expect(mockDatabaseHandlerService.depositToDb).toHaveBeenCalledWith(
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

      mockDatabaseHandlerService.getWallet.mockResolvedValue(wallet);
      mockRemoteService.broadcastWithdrawalTransaction.mockResolvedValue(
        signature
      );
      mockDatabaseHandlerService.withdrawFromDb.mockResolvedValue(undefined);
      mockDatabaseHandlerService.lockWallet.mockResolvedValue(undefined);
      mockDatabaseHandlerService.unlockWallet.mockResolvedValue(undefined);

      await transactionService.handleWithdrawal(userId, walletAddress, amount);

      expect(mockDatabaseHandlerService.getWallet).toHaveBeenCalledWith(userId);
      expect(
        mockRemoteService.broadcastWithdrawalTransaction
      ).toHaveBeenCalledWith(userId, amount, walletAddress);
      expect(mockDatabaseHandlerService.withdrawFromDb).toHaveBeenCalledWith(
        userId,
        amount,
        signature
      );
      expect(mockDatabaseHandlerService.lockWallet).toHaveBeenCalledWith(
        wallet.userId
      );
      expect(mockDatabaseHandlerService.unlockWallet).toHaveBeenCalledWith(
        wallet.userId
      );
    });

    it('should throw InvalidInputError for amount below minimum withdrawal', async () => {
      await expect(
        transactionService.handleWithdrawal(userId, walletAddress, 0.05)
      ).rejects.toThrow(InvalidInputError);
    });

    it('should throw ResourceNotFoundError if wallet not found', async () => {
      mockDatabaseHandlerService.getWallet.mockResolvedValue({} as Wallet);

      await expect(
        transactionService.handleWithdrawal(userId, walletAddress, amount)
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
      mockDatabaseHandlerService.getWallet.mockResolvedValue(wallet);

      await expect(
        transactionService.handleWithdrawal(userId, walletAddress, amount)
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
      mockDatabaseHandlerService.getWallet.mockResolvedValue(wallet);

      await expect(
        transactionService.handleWithdrawal(userId, walletAddress, amount)
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
      mockDatabaseHandlerService.getWallet.mockResolvedValue(wallet);

      const result = await transactionService.getWallet(userId);
      expect(result).toEqual(wallet);
    });

    it('should throw ResourceNotFoundError if wallet not found', async () => {
      const userId = 'testUser';
      mockDatabaseHandlerService.getWallet.mockResolvedValue({} as Wallet);

      await expect(transactionService.getWallet(userId)).rejects.toThrow(
        ResourceNotFoundError
      );
    });
  });

  describe('getBalance', () => {
    it('should return user balance', async () => {
      const userId = 'testUser';

      mockDatabaseHandlerService.getBalance.mockResolvedValue(100);

      const result = await transactionService.getBalance(userId);
      expect(result).toBe(100);
    });
  });

  describe('createWallet', () => {
    it('should create a new wallet for the user', async () => {
      const userId = 'testUser';
      const walletAddress = 'testAddress';

      mockDatabaseHandlerService.addWallet.mockResolvedValue(undefined);

      await transactionService.createWallet(userId, walletAddress);

      expect(mockDatabaseHandlerService.addWallet).toHaveBeenCalledWith(
        userId,
        walletAddress
      );
    });
  });

  describe('updateUserBalance', () => {
    it('should update the user balance', async () => {
      const userId = 'testUser';
      const amount = 100;

      mockDatabaseHandlerService.depositToDb.mockResolvedValue(undefined);

      await transactionService.updateUserBalance(userId, amount);

      expect(mockDatabaseHandlerService.depositToDb).toHaveBeenCalledWith(
        userId,
        amount,
        null,
        false
      );
    });
  });
});
