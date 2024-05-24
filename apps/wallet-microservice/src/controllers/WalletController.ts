import DatabaseHandlerService from '../services/DatabaseHandlerService';
import { Request, Response } from 'express';
import { Currency } from '../types';
import { SendTransactionError, Transaction } from '@solana/web3.js';
import { errorHandler } from '../middleware/ErrorHandler';
import { parseCurrency } from '../utils/WalletUtils';
import { InsufficientBalanceError } from '../errors/InsufficientBalanceError';
import { User } from '../types';
import RemoteService from '../remote/RemoteService';
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError';

class WalletController {
  private databaseHandlerService: DatabaseHandlerService;
  private remoteService: RemoteService;

  constructor() {
    this.databaseHandlerService = new DatabaseHandlerService();
    this.remoteService = new RemoteService('http://localhost:3001/treasury');
  }

  public deposit = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId: string = req.params.userId;
      const walletAddress: string = req.body.walletAddress;
      const currency: Currency = req.body.currency;
      const base64Transaction: string = req.body.signedTransaction;

      console.log(
        `Deposit for user: ${userId} with walletAddress: ${walletAddress}`
      );

      // Switch based on currency (only SOL supported as of now)
      switch (currency) {
        case Currency.SOL:
          // Send the transaction to the treasury and await its response
          const depositTransactionResponse =
            await this.remoteService.broadcastDepositTransaction(
              userId,
              walletAddress,
              currency,
              base64Transaction
            );

          // Deposit the amount to the user's wallet
          await this.databaseHandlerService.depositToDb(
            userId,
            currency,
            depositTransactionResponse.depositAmount,
            depositTransactionResponse.transactionId
          );

          res.status(200).send('Deposit successful');
          break;
        default:
          res.status(400).send('Invalid currency');
          break;
      }
    } catch (error: any) {
      console.log(error);
      if (error instanceof SendTransactionError) {
        res.status(400).send(error.message);
      } else {
        res.status(500).send(error.message);
      }
    }
  };

  public withdraw = async (req: Request, res: Response): Promise<void> => {
    let user: User | null = null;
    const currency: Currency = req.body.currency;

    try {
      const userId: string = req.params.userId;
      const walletAddress: string = req.body.walletAddress;
      const amount: number = req.body.amount;

      // Check if the currency is valid
      if (currency !== Currency.SOL) {
        res.status(400).send('Invalid currency');
        return;
      }

      // Check if the withdrawal amount is more than the minimum (0.1 SOL as of now)
      if (amount <= 0.1) {
        res
          .status(400)
          .send('Invalid withdrawal amount. Minimum withdrawal is 0.1 SOL');
        return;
      }

      // Check if the user has sufficient balance
      user = await this.databaseHandlerService.getUser(userId);
      const wallet = user.wallets.find(
        (wallet) => wallet.currency === currency
      );

      // Check if the wallet exists (could change this to allow withdrawal to any wallet address as long as the user is authorized)
      if (!wallet) {
        res.status(400).send('Wallet not found');
        return;
      }

      // Lock the wallet to prevent race conditions
      await this.databaseHandlerService.lockWallet(user, currency);

      // Check if the user has sufficient balance in order to withdraw
      if (wallet.balance < amount) {
        throw new InsufficientBalanceError('Insufficient balance');
      }

      // Check if the user has any withdrawal requirements
      if (wallet.wagerRequirement > 0) {
        throw new Error('Withdrawal restriction');
      }

      // Send the transaction to the treasury and await its response
      const signature: string =
        await this.remoteService.broadcastWithdrawalTransaction(
          userId,
          amount,
          currency,
          walletAddress
        );

      // Withdraw the amount from the user's wallet
      await this.databaseHandlerService.withdrawFromDb(
        userId,
        currency,
        amount,
        signature
      );

      res.status(200).send('Withdrawal successful');
    } catch (error: any) {
      console.error(error);
      if (error instanceof SendTransactionError) {
        res.status(400).send(error.message);
      } else if (error instanceof InsufficientBalanceError) {
        res.status(400).send(error.message);
      } else {
        res.status(500).send('Internal server error');
      }
    } finally {
      if (user) {
        await this.databaseHandlerService.unlockWallet(user, currency);
      }
    }
  };

  public getWallets = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const currency = req.query.currency;

      // Get the user and their wallets
      const user = await this.databaseHandlerService.getUser(userId);
      let wallets = user.wallets;

      // If a currency is specified, return only that wallet
      if (currency) {
        const parsedCurrency = parseCurrency(currency as string);

        if (!parsedCurrency) {
          res.status(400).send('Invalid currency');
          return;
        }

        // Find the wallet with the specified currency
        const wallet = user.wallets.find(
          (wallet) => wallet.currency === parsedCurrency
        );

        // If the wallet is not found, return a 404
        if (!wallet) {
          throw new ResourceNotFoundError('Wallet not found');
        }

        // Return the wallet
        res.status(200).json(wallet).send();
        return;
      }

      // Return all wallets if no currency is specified
      res.status(200).json(wallets).send();
    } catch (error: any) {
      // Handle any errors
      console.log(error);
      errorHandler(error, res);
    }
  };

  public balance = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const currency = req.query.currency;

      // Get the balance for the user and currency
      if (currency) {
        const parsedCurrency = parseCurrency(currency as string);

        // Return error if the currency is invalid
        if (!parsedCurrency) {
          res.status(400).send('Invalid currency');
          return;
        }

        // Get the balance for the user and currency
        const balance = await this.databaseHandlerService.getBalance(
          userId,
          parsedCurrency
        );

        res.status(200).json({ balance }).send();
        return;
      }

      // Return error if no currency is specified
      res.status(400).send('Invalid currency');
    } catch (error: any) {
      // Handle any errors
      console.log(error);
      errorHandler(error, res);
    }
  };

  public createWallet = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const currency = req.body.currency;
      const walletAddress = req.body.walletAddress;

      // Check if the required fields are present
      if (!userId || !currency || !walletAddress) {
        res.status(400).send('Missing required fields');
        return;
      }

      // Create the wallet (the method will throw an error if the wallet already exists)
      await this.databaseHandlerService.createWallet(
        userId,
        currency,
        walletAddress
      );

      res.status(200).send('Wallet created successfully');
    } catch (error: any) {
      // Handle any errors
      console.log(error);
      errorHandler(error, res);
    }
  };
}

export { WalletController };
