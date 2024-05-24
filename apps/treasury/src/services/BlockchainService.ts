import {
  Connection,
  TransactionSignature,
  SendTransactionError,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  PublicKey,
} from '@solana/web3.js';
import { Currency } from '../../../wallets/src/types';
import { BuildTransactionResponse } from '../types';
import {
  HOUSE_WALLET_ADDRESS,
  HOUSE_WALLET_PRIVATE_KEY,
} from '../utils/TreasuryUtils';
import { InsufficientBalanceError } from '../../../wallets/src/errors/InsufficientBalanceError';

class BlockchainService {
  private connection: Connection;
  constructor() {
    this.connection = new Connection('http://localhost:8899', 'finalized');
  }

  public async getTransactionValueAndVerify(
    transaction: TransactionSignature
  ): Promise<number> {
    // Get the transaction details
    const txDetail = await this.connection.getParsedTransaction(transaction, {
      commitment: 'finalized',
    });

    // Check if the transaction details are valid
    if (txDetail === null || txDetail.meta === null) {
      throw new SendTransactionError('Transaction meta data not found');
    }
    const accountKeys = txDetail.transaction.message.accountKeys;
    let depositAmount: number = 0;

    // Iterate through the account keys to find the deposit amount
    accountKeys.forEach((account, index) => {
      if (account.pubkey.equals(HOUSE_WALLET_ADDRESS)) {
        // LOOK AT THIS CODE AGAIN. I DONT LIKE THE NULL ASSERTION
        depositAmount =
          txDetail.meta!.postBalances[index] -
          txDetail.meta!.preBalances[index];
      }
    });

    // Check if the deposit amount is valid
    if (depositAmount <= 0) {
      throw new SendTransactionError('Invalid deposit amount');
    }
    return depositAmount / LAMPORTS_PER_SOL;
  }

  public broadcastTransactionAndVerify = async (
    transaction: Buffer,
    blockhash: string | null,
    lastValidBlockHeight: number | null
  ): Promise<TransactionSignature> => {
    // Get the latest blockhash and block height if not provided (only in deposits is it not provided)
    if (!blockhash || !lastValidBlockHeight) {
      const latestBlock = await this.connection.getLatestBlockhash();
      blockhash = latestBlock.blockhash;
      lastValidBlockHeight = latestBlock.lastValidBlockHeight;
    }

    const signature = await this.connection.sendRawTransaction(transaction);
    const result = await this.connection.confirmTransaction(
      {
        signature: signature,
        lastValidBlockHeight: lastValidBlockHeight,
        blockhash: blockhash,
      },
      'finalized'
    );

    if (result.value.err) {
      throw new InsufficientBalanceError(
        'Wallet has insufficient balance to process the transaction'
      );
    }

    return signature;
  };

  public async buildTransaction(
    toWalletAddress: string,
    amount: number,
    currency: Currency
  ): Promise<BuildTransactionResponse> {
    // Get the latest blockhash and block height from the blockchain
    const latestBlock = await this.connection.getLatestBlockhash();
    const blockhash = latestBlock.blockhash;
    const blockHeight = latestBlock.lastValidBlockHeight;

    // Set the sender and receiver public keys
    const fromPubKey = HOUSE_WALLET_ADDRESS;
    const toPubKey = new PublicKey(toWalletAddress);

    // Create a temporary transaction to calculate the fee
    let transactionTemp = new Transaction({
      blockhash: blockhash,
      feePayer: fromPubKey,
      lastValidBlockHeight: blockHeight,
    }).add(
      SystemProgram.transfer({
        fromPubkey: fromPubKey,
        toPubkey: toPubKey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    // Get the fee for the transaction
    const feeCalculator = await this.connection.getFeeForMessage(
      transactionTemp.compileMessage(),
      'finalized'
    );

    // Check if the fee is valid
    if (feeCalculator.value === null) {
      throw new SendTransactionError('Error in fee calculation');
    }

    // Calculate the fee
    const fee: number = feeCalculator.value / LAMPORTS_PER_SOL;

    // Create a new transaction object with the adjusted amount (ensure that the fee is payed for by the user and not the house)
    let adjustedTransaction = new Transaction({
      blockhash: blockhash,
      feePayer: fromPubKey,
      lastValidBlockHeight: blockHeight,
    }).add(
      SystemProgram.transfer({
        fromPubkey: fromPubKey,
        toPubkey: toPubKey,
        lamports: (amount - fee) * LAMPORTS_PER_SOL,
      })
    );

    // Sign the transaction with the house wallet private key and return it
    adjustedTransaction.sign(HOUSE_WALLET_PRIVATE_KEY);

    const resp: BuildTransactionResponse = {
      transactionSignature: adjustedTransaction,
      blockhash: blockhash,
      lastValidBlockHeight: blockHeight,
    };

    return resp;
  }
}

export default BlockchainService;
