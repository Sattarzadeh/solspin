enum Currency {
  SOL = 'SOL',
  BTC = 'BTC',
  ETH = 'ETH',
}

type Wallet = {
  userId: string;
  balance: number;
  wagerRequirement: number;
  address?: string;
  lockedAt: string;
};

type Transaction = {
  transactionId: string;
  userId: string;
  amount: number;
  type: TransactionPurpose; // Deposit/Withdraw
  timestamp: string;
};

enum TransactionPurpose {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
}

type DepositTransactionResponse = {
  message: string;
  depositAmount: number;
  transactionId: string;
};

export {
  Currency,
  Wallet,
  Transaction,
  TransactionPurpose,
  DepositTransactionResponse,
};
