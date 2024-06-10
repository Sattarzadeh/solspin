import { Transaction } from '@solana/web3.js';

type BuildTransactionResponse = {
  transactionSignature: Transaction;
  blockhash: string;
  lastValidBlockHeight: number;
};

export { BuildTransactionResponse };
