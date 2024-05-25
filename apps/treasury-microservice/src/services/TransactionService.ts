import {
  Currency,
  DepositTransactionResponse,
} from '@shared-types/shared-types';
import BlockchainService from '../services/BlockchainService';
import { Transaction } from '@solana/web3.js';
import { BuildTransactionResponse } from '../types';
import { InvalidInputError } from '@shared-errors/InvalidInputError';

const DEPOSIT_COMMITMENT_LEVEL = 'finalized';
const WITHDRAWAL_COMMITMENT_LEVEL = 'finalized';

export class TransactionService {
  constructor(private blockchainService: BlockchainService) {}

  public async processWithdrawal(
    userId: string,
    amount: number,
    currency: Currency,
    walletAddress: string
  ): Promise<{ signature: string }> {
    // Validate request
    if (!userId || !amount || !currency || !walletAddress) {
      throw new InvalidInputError('Invalid request');
    }

    // Parse currency from request
    const parsedCurrency = this.parseCurrency(currency);

    if (!parsedCurrency || parsedCurrency !== Currency.SOL) {
      throw new InvalidInputError('Invalid currency');
    }

    // Build transaction and get blockhash and lastValidBlockHeight
    const {
      transactionSignature,
      blockhash,
      lastValidBlockHeight,
    }: BuildTransactionResponse = await this.blockchainService.buildTransaction(
      walletAddress,
      amount
    );

    // Broadcast transaction and verify it was successful
    const signature =
      await this.blockchainService.broadcastTransactionAndVerify(
        transactionSignature.serialize(),
        blockhash,
        lastValidBlockHeight,
        WITHDRAWAL_COMMITMENT_LEVEL
      );

    console.log(
      `User: ${userId}, Withdrawal successful. Amount: ${amount} SOL, Transaction signature: ${signature}`
    );

    return { signature };
  }

  public async processDeposit(
    userId: string,
    walletAddress: string,
    currency: Currency,
    base64Transaction: string
  ): Promise<DepositTransactionResponse> {
    // Validate request
    if (!userId || !currency || !walletAddress || !base64Transaction) {
      throw new InvalidInputError('Invalid request');
    }

    // Parse currency from request
    const parsedCurrency = this.parseCurrency(currency);

    if (!parsedCurrency || parsedCurrency !== Currency.SOL) {
      throw new InvalidInputError('Invalid currency');
    }

    // Create transaction object from base64 encoded string
    const transactionSerialized: Buffer = Buffer.from(
      base64Transaction,
      'base64'
    );
    const transaction = Transaction.from(transactionSerialized);

    // Validate fee payer (ensure it is not the house wallet address that is the feepayer)
    if (transaction.feePayer.toBase58() === process.env.HOUSE_WALLET_ADDRESS) {
      throw new InvalidInputError('Invalid fee payer');
    }

    // Broadcast transaction and verify it was successful
    const transactionSignature =
      await this.blockchainService.broadcastTransactionAndVerify(
        transactionSerialized,
        null,
        null,
        DEPOSIT_COMMITMENT_LEVEL
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
    return {
      message: `Deposit successful`,
      depositAmount: depositAmount,
      transactionId: transactionSignature,
    };
  }

  private parseCurrency(currency: string): Currency | null {
    // Implement your logic to parse and validate the currency here
    // Assuming Currency is an enum or a similar type.
    // Return null if the currency is invalid.
    return currency as Currency;
  }
}
