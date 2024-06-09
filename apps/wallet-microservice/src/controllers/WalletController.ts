import DatabaseHandlerService from '../repository/Repository';
import { Request, Response } from 'express';
import { errorHandler } from '@shared-errors/ErrorHandler';
import RemoteService from '../remote/TreasuryRemote';
import { TransactionService } from '../services/TransactionService';
import { InvalidInputError } from '@shared-types/errors/InvalidInputError';

class WalletController {
  private transactionService: TransactionService;

  constructor() {
    const databaseHandlerService = new DatabaseHandlerService();
    const remoteService = new RemoteService('http://localhost:3001/treasury');
    this.transactionService = new TransactionService(
      remoteService,
      databaseHandlerService
    );
  }

  public deposit = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const { walletAddress, signedTransaction: base64Transaction } = req.body;

      console.log(
        `Deposit for user: ${userId} with walletAddress: ${walletAddress}`
      );

      await this.transactionService.handleDeposit(
        userId,
        walletAddress,
        base64Transaction
      );

      res.status(200).send('Deposit successful');
    } catch (error) {
      errorHandler(error, res);
    }
  };

  public withdraw = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const { walletAddress, amount } = req.body;

      await this.transactionService.handleWithdrawal(
        userId,
        walletAddress,
        amount
      );

      res.status(200).send('Withdrawal successful');
    } catch (error) {
      errorHandler(error, res);
    }
  };

  public balance = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;

      const balance = await this.transactionService.getBalance(userId);
      res.status(200).json({ balance }).send();
    } catch (error) {
      errorHandler(error, res);
    }
  };

  public createWallet = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const { walletAddress } = req.body;

      if (!userId || !walletAddress) {
        res.status(400).send('Missing required fields');
        return;
      }

      await this.transactionService.createWallet(userId, walletAddress);
      res.status(200).send('Wallet created successfully');
    } catch (error) {
      errorHandler(error, res);
    }
  };

  public updateBalance = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const amount = req.body.amount;

      console.log('Updating balance for user:', userId, amount);
      if (!userId || !amount) {
        throw new InvalidInputError('Missing required fields');
      }

      await this.transactionService.updateUserBalance(userId, amount);

      res.status(200).send('Balance updated successfully');
    } catch (error) {
      errorHandler(error, res);
    }
  };
}

export { WalletController };
