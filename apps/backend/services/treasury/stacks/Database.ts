import { StackContext, Table } from "sst/constructs";
import { RemovalPolicy } from "aws-cdk-lib";

export function DatabaseStack({ stack }: StackContext) {
  const removeOnDelete = stack.stage !== "prod";

  const transactionsTable = new Table(stack, "transactions", {
    fields: {
      id: "string",
      userId: "string",
      amount: "number", // Available balance in the wallet.
      walletAddress: "string", // Wallet address of the user.
      txnId: "string", // Transaction ID.
      createdAt: "string",
      type: "string", // Type of transaction (deposit, withdraw).
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
    transactionsTableArn: transactionsTable.tableArn,
    transactionsTableName: transactionsTable.tableName,
  };
}
