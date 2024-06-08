import { Table, StackContext, App, StackProps } from 'sst/constructs';

export function TableStack({ stack }: StackContext) {
  // Create a new DynamoDB table for storing bets
  const betsTable = new Table(this, 'Bets', {
    fields: {
      betId: 'string',
      userId: 'string',
      amountBet: 'number', // how much they bet
      outcome: 'string', // WIN || LOSE
      outcomeAmount: 'number', // how much they won from the bet
      timestamp: 'string',
      gameId: 'string', // which game they played
    },
    primaryIndex: { partitionKey: 'userId', sortKey: 'betId' },
    globalIndexes: {
      betHistoryIndex: {
        partitionKey: 'userId',
        sortKey: 'timestamp',
      },
    },
  });

  const walletTable = new Table(this, 'Wallets', {
    fields: {
      userId: 'string',
      balance: 'number',
      wagerRequirement: 'number',
      address: 'string',
    },
    primaryIndex: { partitionKey: 'userId' },
  });

  const transactionTable = new Table(this, 'Transactions', {
    fields: {
      transactionId: 'string',
      userId: 'string',
      amount: 'number',
      type: 'string', // DEPOSIT || WITHDRAWAL
      timestamp: 'string',
    },
    primaryIndex: { partitionKey: 'userId', sortKey: 'transactionId' },
    globalIndexes: {
      transactionHistoryIndex: {
        partitionKey: 'userId',
        sortKey: 'timestamp',
      },
    },
  });
}
