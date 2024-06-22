import {
  Commitment,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionSignature,
} from "@solana/web3.js";
import { BuildTransactionResponse } from "@solspin/treasury-types";
import { HOUSE_WALLET_ADDRESS, HOUSE_WALLET_PRIVATE_KEY } from "../utils/TreasuryUtils";
import {
  BlockchainTransactionError,
  InsufficientBalanceError,
  InvalidInputError,
} from "@solspin/errors";

const FEE = 5000;

/*

  Commitment levels:

  - processed: The transaction has been included in a block.
  - confirmed: The transaction has been included in a block that has been voted on by the supermajority of the cluster.
  - finalized: The transaction has been included in a block that has been finalized by the cluster.

  We should use 'finalized' for deposits because we want to ensure deposits cannot be
  reverted. This prevents us from crediting the user account and then having the deposit transaction fail.

  We use 'confirmed' for withdrawals because we want to have fast withdrawals to boost user satisfaction. Also, it's not as important to have withdrawals
  finalized because if they are reverted, the funds are still in the house wallet.

  */

class BlockchainService {
  private connection = new Connection("http://127.0.0.1:8899", "finalized");

  public async getTransactionValueAndVerify(transaction: TransactionSignature): Promise<number> {
    // Get the transaction details
    const txDetail = await this.connection.getParsedTransaction(transaction, {
      commitment: "finalized",
    });

    // Check if the transaction details are valid
    if (txDetail === null || txDetail.meta === null) {
      throw new BlockchainTransactionError("Transaction meta data not found");
    }
    const accountKeys = txDetail.transaction.message.accountKeys;
    let depositAmount = 0;

    // Iterate through the account keys to find the deposit amount
    accountKeys.forEach((account, index) => {
      if (account.pubkey.equals(HOUSE_WALLET_ADDRESS)) {
        depositAmount = txDetail.meta.postBalances[index] - txDetail.meta.preBalances[index];
      }
    });

    // Check if the deposit amount is valid
    if (depositAmount <= 0) {
      throw new InvalidInputError("Invalid deposit amount");
    }
    return depositAmount / LAMPORTS_PER_SOL;
  }

  public broadcastTransactionAndVerify = async (
    transaction: Buffer,
    blockhash: string | null,
    lastValidBlockHeight: number | null,
    commitment: string
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
      commitment as Commitment
    );

    if (result.value.err) {
      throw new InsufficientBalanceError(
        "Wallet has insufficient balance to process the transaction"
      );
    }

    return signature;
  };

  public async buildTransaction(
    toWalletAddress: string,
    amount: number
  ): Promise<BuildTransactionResponse> {
    // Get the latest blockhash and block height from the blockchain
    const latestBlock = await this.connection.getLatestBlockhash();
    const blockhash = latestBlock.blockhash;
    const blockHeight = latestBlock.lastValidBlockHeight;

    // Set the sender and receiver public keys
    const fromPubKey = HOUSE_WALLET_ADDRESS;
    const toPubKey = new PublicKey(toWalletAddress);

    // Calculate LAMPORTS to send
    const lamportsAmount = Math.round(amount * LAMPORTS_PER_SOL) - FEE;

    // Create a new transaction object with the adjusted amount (ensure that the fee is payed for by the user and not the house)
    const transaction = new Transaction({
      blockhash: blockhash,
      feePayer: fromPubKey,
      lastValidBlockHeight: blockHeight,
    }).add(
      SystemProgram.transfer({
        fromPubkey: fromPubKey,
        toPubkey: toPubKey,
        lamports: lamportsAmount,
      })
    );

    // Sign the transaction with the house wallet private key and return it
    transaction.sign(HOUSE_WALLET_PRIVATE_KEY);

    return {
      transactionSignature: transaction,
      blockhash: blockhash,
      lastValidBlockHeight: blockHeight,
    };
  }
}

export default BlockchainService;
