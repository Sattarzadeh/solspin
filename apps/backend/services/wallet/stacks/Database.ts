import { StackContext, Table } from "sst/constructs";
import { RemovalPolicy } from "aws-cdk-lib";

export function DatabaseStack({ stack }: StackContext) {
  const removeOnDelete = stack.stage !== "prod";

  const walletsTable = new Table(stack, "wallets", {
    fields: {
      userId: "string",
      balance: "number", // Available balance in the wallet.
      wagerRequirement: "number", // Amount that needs to be wagered before the user can withdraw.
      walletAddress: "string", // Wallet address of the user.
      lockedAt: "string", // timestamp when the wallet was locked.
      createdAt: "string",
    },
    primaryIndex: { partitionKey: "userId" },
    cdk: {
      table: {
        removalPolicy: removeOnDelete ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
      },
    },
  });

  const transactionsTable = new Table(stack, "transactions", {
    fields: {
      id: "string",
      userId: "string",
      amount: "number",
      createdAt: "string",
      walletAddress: "string",
      type: "string",
    },
    primaryIndex: { partitionKey: "id" },
    globalIndexes: {
      byUserId: { partitionKey: "userId", sortKey: "createdAt" },
      byType: { partitionKey: "type", sortKey: "createdAt" },
      byWalletAddress: { partitionKey: "walletAddress", sortKey: "createdAt" },
    },
    cdk: {
      table: {
        removalPolicy: removeOnDelete ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
      },
    },
  });

  return {
    walletsTableArn: walletsTable.tableArn,
    walletsTableName: walletsTable.tableName,
    transactionsTableArn: transactionsTable.tableArn,
    transactionsTableName: transactionsTable.tableName,
  };
}
