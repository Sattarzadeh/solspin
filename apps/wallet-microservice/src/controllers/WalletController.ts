import DatabaseHandlerService from '../services/DatabaseHandlerService';
import { Request, Response } from 'express';
import { errorHandler } from '../middleware/ErrorHandler';
import RemoteService from '../remote/RemoteService';
import { TransactionService } from '../services/TransactionService';

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
      const {
        walletAddress,
        currency,
        signedTransaction: base64Transaction,
      } = req.body;

      console.log(
        `Deposit for user: ${userId} with walletAddress: ${walletAddress}`
      );

      await this.transactionService.handleDeposit(
        userId,
        walletAddress,
        currency,
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
      const { walletAddress, currency, amount } = req.body;

      await this.transactionService.handleWithdrawal(
        userId,
        walletAddress,
        currency,
        amount
      );

      res.status(200).send('Withdrawal successful');
    } catch (error) {
      errorHandler(error, res);
    }
  };

  public getWallets = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const currency = req.query.currency as string | undefined;

      const wallets = await this.transactionService.getUserWallets(
        userId,
        currency
      );

      res.status(200).json(wallets).send();
    } catch (error) {
      errorHandler(error, res);
    }
  };

  public balance = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const currency = req.query.currency as string;

      if (!currency) {
        res.status(400).send('Invalid currency');
        return;
      }

      const balance = await this.transactionService.getUserBalance(
        userId,
        currency
      );
      res.status(200).json({ balance }).send();
    } catch (error) {
      errorHandler(error, res);
    }
  };

  public createWallet = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const { currency, walletAddress } = req.body;

      if (!userId || !currency || !walletAddress) {
        res.status(400).send('Missing required fields');
        return;
      }

      await this.transactionService.createUserWallet(
        userId,
        currency,
        walletAddress
      );
      res.status(200).send('Wallet created successfully');
    } catch (error) {
      errorHandler(error, res);
    }
  };
}

export { WalletController };
