import {
  Currency,
  DepositTransactionResponse,
} from '../../../wallet-microservice/src/types';
import { parseCurrency } from '../../../wallet-microservice/src/utils/WalletUtils';
import { Request, Response } from 'express';
import BlockchainService from '../services/BlockchainService';
import { Transaction } from '@solana/web3.js';
import { BuildTransactionResponse } from '../types';

class TreasuryController {
  private blockchainService: BlockchainService;

  constructor() {
    this.blockchainService = new BlockchainService();
    this.withdraw = this.withdraw.bind(this);
    this.deposit = this.deposit.bind(this);
  }

  public async withdraw(req: Request, res: Response): Promise<void> {
    try {
      console.log('Withdraw request received');
      const userId = req.params.userId;
      const amount = req.body.amount;
      const currency = req.body.currency;
      const walletAddress = req.body.walletAddress;

      // Validate request
      if (!userId || !amount || !currency || !walletAddress) {
        res.status(400).send('Invalid request');
        return;
      }

      // Parse currency from request
      const parsedCurrency = parseCurrency(currency as string);

      if (!parsedCurrency) {
        res.status(400).send('Invalid currency');
        return;
      }

      // Switch based on currency (only SOL supported as of now)
      switch (currency) {
        case Currency.SOL:
          // Build transaction and get blockhash and lastValidBlockHeight
          const {
            transactionSignature,
            blockhash,
            lastValidBlockHeight,
          }: BuildTransactionResponse =
            await this.blockchainService.buildTransaction(
              walletAddress,
              amount,
              currency
            );

          // Broadcast transaction and verify it was successful
          const signature =
            await this.blockchainService.broadcastTransactionAndVerify(
              transactionSignature.serialize(),
              blockhash,
              lastValidBlockHeight
            );

          console.log(
            `User: ${userId}, Withdrawal successfull Amount: ${amount} SOL, Transaction signature: ${signature}`
          );

          // Return transaction signature (id) to wallet service
          res.status(200).send({ signature: signature });
          break;
        default:
          res.status(400).send('Invalid currency');
          break;
      }
    } catch (error: any) {
      console.log(error);
      res.status(500).send('Internal server error');
    }
  }

  public async deposit(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = req.params.userId;
      const walletAddress: string = req.body.walletAddress;
      const currency: Currency = req.body.currency;
      const base64Transaction: string = req.body.signedTransaction;

      console.log(
        `Deposit request received for user: ${userId}, wallet_address: ${walletAddress}, currency: ${currency}, signed_transaction: ${base64Transaction}`
      );

      // Validate request
      if (!userId || !currency || !walletAddress || !base64Transaction) {
        res.status(400).send('Invalid request');
        return;
      }

      // Parse currency from request
      const parsedCurrency = parseCurrency(currency as string);

      if (!parsedCurrency) {
        res.status(400).send('Invalid currency');
        return;
      }

      // Switch based on currency (only SOL supported as of now)
      switch (parsedCurrency) {
        case Currency.SOL:
          // Create transaction object from base64 encoded string
          const transactionSerialized: Buffer = Buffer.from(
            base64Transaction,
            'base64'
          );

          const transaction = Transaction.from(transactionSerialized);

          // Validate fee payer (ensure it is not the house wallet address that is the feepayer)
          if (
            transaction.feePayer.toBase58() === process.env.HOUSE_WALLET_ADDRESS
          ) {
            res.status(400).send('Invalid fee payer');
            return;
          }

          // Broadcast transaction and verify it was successful
          const transactionSignature =
            await this.blockchainService.broadcastTransactionAndVerify(
              transactionSerialized,
              null,
              null
            );

          // Get deposit amount from transaction and verify it
          const depositAmount =
            await this.blockchainService.getTransactionValueAndVerify(
              transactionSignature
            );

          console.log(
            `Deposit successful: User: ${userId}, Deposit Amount: ${depositAmount} SOL, Transaction signature: ${transactionSignature}`
          );

          // Build response object
          const params: DepositTransactionResponse = {
            message: `Deposit successful`,
            depositAmount: depositAmount,
            transactionId: transactionSignature,
          };

          // Return response object to wallet service
          res.status(200).send(JSON.stringify(params));
          break;
        default:
          res.status(400).send('Invalid currency');
          break;
      }
    } catch (error: any) {
      console.log(error);
      res.status(500).send('Internal server error');
    }
  }
}

export { TreasuryController };
