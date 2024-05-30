enum Currency {
  SOL = 'SOL',
  BTC = 'BTC',
  ETH = 'ETH',
}

type Wallet = {
  currency: Currency;
  balance: number;
  wagerRequirement: number;
  address: string;
  lockedAt: string;
};

type User = {
  user_id: string;
  wallets: Wallet[];
};

type UserAndWallet = {
  user: User;
  wallet: Wallet;
};

type Transaction = {
  transaction_id: string;
  userId: string;
  amount: number;
  type: TransactionPurpose; // Deposit/Withdraw
  timestamp: string;
  currency: Currency;
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
  User,
  UserAndWallet,
  Transaction,
  TransactionPurpose,
  DepositTransactionResponse,
};
