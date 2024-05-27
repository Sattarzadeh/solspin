import { TransactionService } from '../../services/TransactionService';
import DatabaseHandlerService from '../../services/DatabaseHandlerService';
import RemoteService from '../../services/RemoteService';
import {
  Currency,
  DepositTransactionResponse,
  User,
} from '@shared-types/shared-types';
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
  let transactionService: TransactionService;
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
      const currency = Currency.SOL;
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
        currency,
        base64Transaction
      );

      expect(
        mockRemoteService.broadcastDepositTransaction
      ).toHaveBeenCalledWith(
        userId,
        walletAddress,
        currency,
        base64Transaction
      );
      expect(mockDatabaseHandlerService.depositToDb).toHaveBeenCalledWith(
        userId,
        currency,
        depositResponse.depositAmount,
        depositResponse.transactionId
      );
    });

    it('should throw InvalidInputError for unsupported currency', async () => {
      await expect(
        transactionService.handleDeposit(
          'userId',
          'walletAddress',
          'BTC' as Currency,
          'transaction'
        )
      ).rejects.toThrow(InvalidInputError);
    });
  });

  describe('handleWithdrawal', () => {
    const userId = 'testUser';
    const walletAddress = 'testAddress';
    const currency = Currency.SOL;
    const amount = 1;

    it('should handle SOL withdrawal successfully', async () => {
      const user: User = {
        user_id: userId,
        wallets: [
          {
            currency,
            balance: 100,
            wagerRequirement: 0,
            address: walletAddress,
            lockedAt: '0',
          },
        ],
      };
      const signature = 'testSignature';

      mockDatabaseHandlerService.getUser.mockResolvedValue(user);
      mockRemoteService.broadcastWithdrawalTransaction.mockResolvedValue(
        signature
      );
      mockDatabaseHandlerService.withdrawFromDb.mockResolvedValue(undefined);
      mockDatabaseHandlerService.lockWallet.mockResolvedValue(undefined);
      mockDatabaseHandlerService.unlockWallet.mockResolvedValue(undefined);

      await transactionService.handleWithdrawal(
        userId,
        walletAddress,
        currency,
        amount
      );

      expect(mockDatabaseHandlerService.getUser).toHaveBeenCalledWith(userId);
      expect(
        mockRemoteService.broadcastWithdrawalTransaction
      ).toHaveBeenCalledWith(userId, amount, currency, walletAddress);
      expect(mockDatabaseHandlerService.withdrawFromDb).toHaveBeenCalledWith(
        userId,
        currency,
        amount,
        signature
      );
      expect(mockDatabaseHandlerService.lockWallet).toHaveBeenCalledWith(
        user,
        currency
      );
      expect(mockDatabaseHandlerService.unlockWallet).toHaveBeenCalledWith(
        user,
        currency
      );
    });

    it('should throw InvalidInputError for unsupported currency', async () => {
      await expect(
        transactionService.handleWithdrawal(
          userId,
          walletAddress,
          'BTC' as Currency,
          amount
        )
      ).rejects.toThrow(InvalidInputError);
    });

    it('should throw InvalidInputError for amount below minimum withdrawal', async () => {
      await expect(
        transactionService.handleWithdrawal(
          userId,
          walletAddress,
          currency,
          0.05
        )
      ).rejects.toThrow(InvalidInputError);
    });

    it('should throw ResourceNotFoundError if wallet not found', async () => {
      const user: User = { user_id: userId, wallets: [] };
      mockDatabaseHandlerService.getUser.mockResolvedValue(user);

      await expect(
        transactionService.handleWithdrawal(
          userId,
          walletAddress,
          currency,
          amount
        )
      ).rejects.toThrow(ResourceNotFoundError);
    });

    it('should throw InsufficientBalanceError if balance is insufficient', async () => {
      const user: User = {
        user_id: userId,
        wallets: [
          {
            currency,
            balance: 0,
            wagerRequirement: 0,
            address: walletAddress,
            lockedAt: '0',
          },
        ],
      };
      mockDatabaseHandlerService.getUser.mockResolvedValue(user);

      await expect(
        transactionService.handleWithdrawal(
          userId,
          walletAddress,
          currency,
          amount
        )
      ).rejects.toThrow(InsufficientBalanceError);
    });

    it('should throw InvalidInputError if there is an active wager requirement', async () => {
      const user: User = {
        user_id: userId,
        wallets: [
          {
            currency,
            balance: 200,
            wagerRequirement: 50,
            address: walletAddress,
            lockedAt: '0',
          },
        ],
      };
      mockDatabaseHandlerService.getUser.mockResolvedValue(user);

      await expect(
        transactionService.handleWithdrawal(
          userId,
          walletAddress,
          currency,
          amount
        )
      ).rejects.toThrow(InvalidInputError);
    });
  });

  describe('getUserWallets', () => {
    it('should return user wallets', async () => {
      const userId = 'testUser';
      const user: User = {
        user_id: userId,
        wallets: [
          {
            currency: Currency.SOL,
            balance: 100,
            wagerRequirement: 0,
            address: 'testAddress',
            lockedAt: '0',
          },
        ],
      };
      mockDatabaseHandlerService.getUser.mockResolvedValue(user);

      const result = await transactionService.getUserWallets(userId);
      expect(result).toEqual(user.wallets);
    });

    it('should return specific wallet if currency is provided', async () => {
      const userId = 'testUser';
      const currency = Currency.SOL;
      const user: User = {
        user_id: userId,
        wallets: [
          {
            currency,
            balance: 100,
            wagerRequirement: 0,
            address: 'testAddress',
            lockedAt: '0',
          },
        ],
      };
      mockDatabaseHandlerService.getUser.mockResolvedValue(user);

      const result = await transactionService.getUserWallets(userId, 'SOL');
      expect(result).toEqual(user.wallets[0]);
    });

    it('should throw InvalidInputError for invalid currency', async () => {
      const userId = 'testUser';
      mockDatabaseHandlerService.getUser.mockResolvedValue({
        user_id: userId,
        wallets: [],
      });

      await expect(
        transactionService.getUserWallets(userId, 'INVALID')
      ).rejects.toThrow(InvalidInputError);
    });

    it('should throw ResourceNotFoundError if wallet not found', async () => {
      const userId = 'testUser';
      mockDatabaseHandlerService.getUser.mockResolvedValue({
        user_id: userId,
        wallets: [],
      });

      await expect(
        transactionService.getUserWallets(userId, 'SOL')
      ).rejects.toThrow(ResourceNotFoundError);
    });
  });

  describe('getUserBalance', () => {
    it('should return user balance for specified currency', async () => {
      const userId = 'testUser';
      const currency = Currency.SOL;
      mockDatabaseHandlerService.getBalance.mockResolvedValue(100);

      const result = await transactionService.getUserBalance(userId, 'SOL');
      expect(result).toBe(100);
    });

    it('should throw InvalidInputError for invalid currency', async () => {
      await expect(
        transactionService.getUserBalance('testUser', 'INVALID')
      ).rejects.toThrow(InvalidInputError);
    });
  });

  describe('createUserWallet', () => {
    it('should create a new wallet for the user', async () => {
      const userId = 'testUser';
      const currency = Currency.SOL;
      const walletAddress = 'testAddress';

      mockDatabaseHandlerService.createWallet.mockResolvedValue(undefined);

      await transactionService.createUserWallet(
        userId,
        currency,
        walletAddress
      );

      expect(mockDatabaseHandlerService.createWallet).toHaveBeenCalledWith(
        userId,
        currency,
        walletAddress
      );
    });
  });

  describe('updateUserBalance', () => {
    it('should update the user balance', async () => {
      const userId = 'testUser';
      const currency = Currency.SOL;
      const amount = 100;

      mockDatabaseHandlerService.depositToDb.mockResolvedValue(undefined);

      await transactionService.updateUserBalance(userId, currency, amount);

      expect(mockDatabaseHandlerService.depositToDb).toHaveBeenCalledWith(
        userId,
        currency,
        amount,
        null,
        false
      );
    });
  });
});
