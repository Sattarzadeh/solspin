export type DepositTransactionResponse = {
  message: string;
  depositAmount: number;
  transactionId: string;
};

export enum TransactionPurpose {
  Deposit = "Deposit",
  Withdraw = "Withdraw",
}

export type Transaction = {
  transactionId: string;
  userId: string;
  amount: number;
  type: TransactionPurpose; // Deposit/Withdraw
  timestamp: string;
};

export type Wallet = {
  userId: string;
  balance: number;
  wagerRequirement: number;
  address: string;
  lockedAt: string;
};
