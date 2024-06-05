import { Request, Response } from 'express';
import { TransactionService } from '../services/TransactionService';
import BlockchainService from '../services/BlockchainService';

export class TreasuryController {
  private transactionService: TransactionService;

  constructor() {
    const blockchainService = new BlockchainService();
    this.transactionService = new TransactionService(blockchainService);
  }

  public withdraw = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('Withdraw request received');
      const userId = req.params.userId;
      const { amount, currency, walletAddress } = req.body;

      if (!userId || !amount || !currency || !walletAddress) {
        res.status(400).send('Invalid request');
        return;
      }

      console.log(amount);
      const { signature } = await this.transactionService.processWithdrawal(
        userId,
        amount,
        currency,
        walletAddress
      );

      // Return transaction signature (id) to wallet service
      res.status(200).send({ signature });
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal server error');
    }
  };

  public deposit = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId: string = req.params.userId;
      const {
        walletAddress,
        currency,
        signedTransaction: base64Transaction,
      } = req.body;

      console.log(
        `Deposit request received for user: ${userId}, wallet_address: ${walletAddress}, currency: ${currency}, signed_transaction: ${base64Transaction}`
      );

      const response = await this.transactionService.processDeposit(
        userId,
        walletAddress,
        currency,
        base64Transaction
      );

      // Return response object to wallet service
      res.status(200).send(JSON.stringify(response));
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal server error');
    }
  };
}
