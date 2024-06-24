export interface TransactionsDBObject {
  id: string;
  userId: string;
  amount: number;
  createdAt: string;
  walletAddress: string;
  txnId: string;
  type: TransactionType;
}

export enum TransactionType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}
