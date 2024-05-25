import DatabaseHandlerService from '../services/DatabaseHandlerService';
import { Currency } from '@shared-types/shared-types';
import { parseCurrency } from '@shared-types/BlockchainUtils';
import { InsufficientBalanceError } from '@shared-errors/InsufficientBalanceError';
import { InvalidInputError } from '@shared-errors/InvalidInputError';
import RemoteService from '../remote/RemoteService';
import { ResourceNotFoundError } from '@shared-errors/ResourceNotFoundError';

const MIN_WITHDRAWAL_AMOUNT_SOL = 0.1;

export class TransactionService {
  constructor(
    private remoteService: RemoteService,
    private databaseHandlerService: DatabaseHandlerService
  ) {}

  public async handleDeposit(
    userId: string,
    walletAddress: string,
    currency: Currency,
    base64Transaction: string
  ): Promise<void> {
    switch (currency) {
      case Currency.SOL:
        const depositTransactionResponse =
          await this.remoteService.broadcastDepositTransaction(
            userId,
            walletAddress,
            currency,
            base64Transaction
          );

        await this.databaseHandlerService.depositToDb(
          userId,
          currency,
          depositTransactionResponse.depositAmount,
          depositTransactionResponse.transactionId
        );
        break;
      default:
        throw new InvalidInputError('Invalid currency');
    }
  }

  public async handleWithdrawal(
    userId: string,
    walletAddress: string,
    currency: Currency,
    amount: number
  ): Promise<void> {
    if (currency !== Currency.SOL) {
      throw new InvalidInputError('Invalid currency');
    }

    if (amount < MIN_WITHDRAWAL_AMOUNT_SOL) {
      throw new InvalidInputError(
        `Invalid withdrawal amount. Minimum withdrawal is ${MIN_WITHDRAWAL_AMOUNT_SOL} SOL`
      );
    }

    const user = await this.databaseHandlerService.getUser(userId);
    const wallet = user.wallets.find((wallet) => wallet.currency === currency);

    if (!wallet) {
      throw new ResourceNotFoundError('Wallet not found');
    }

    await this.databaseHandlerService.lockWallet(user, currency);

    try {
      if (wallet.balance < amount) {
        throw new InsufficientBalanceError('Insufficient balance');
      }

      if (wallet.wagerRequirement > 0) {
        throw new InvalidInputError(
          `You still have an active wager requirement of ${wallet.wagerRequirement} ${currency}`
        );
      }

      const signature = await this.remoteService.broadcastWithdrawalTransaction(
        userId,
        amount,
        currency,
        walletAddress
      );

      await this.databaseHandlerService.withdrawFromDb(
        userId,
        currency,
        amount,
        signature
      );
    } catch (error: unknown) {
      throw error;
    } finally {
      await this.databaseHandlerService.unlockWallet(user, currency);
    }
  }

  public async getUserWallets(userId: string, currency?: string) {
    const user = await this.databaseHandlerService.getUser(userId);
    if (currency) {
      const parsedCurrency = parseCurrency(currency);

      if (!parsedCurrency) {
        throw new InvalidInputError('Invalid currency');
      }

      const wallet = user.wallets.find(
        (wallet) => wallet.currency === parsedCurrency
      );
      if (!wallet) {
        throw new ResourceNotFoundError('Wallet not found');
      }

      return wallet;
    }
    return user.wallets;
  }

  public async getUserBalance(userId: string, currency: string) {
    const parsedCurrency = parseCurrency(currency);

    if (!parsedCurrency) {
      throw new InvalidInputError('Invalid currency');
    }

    return await this.databaseHandlerService.getBalance(userId, parsedCurrency);
  }

  public async createUserWallet(
    userId: string,
    currency: Currency,
    walletAddress: string
  ) {
    await this.databaseHandlerService.createWallet(
      userId,
      currency,
      walletAddress
    );
  }
}
