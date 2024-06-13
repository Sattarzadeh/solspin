import { Transaction } from "@solana/web3.js";

export type BuildTransactionResponse = {
  transactionSignature: Transaction;
  blockhash: string;
  lastValidBlockHeight: number;
};
