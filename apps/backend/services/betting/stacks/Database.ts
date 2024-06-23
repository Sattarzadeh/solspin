import { StackContext, Table } from "sst/constructs";
import { RemovalPolicy } from "aws-cdk-lib";

export function DatabaseStack({ stack }: StackContext) {
  const removeOnDelete = stack.stage !== "prod";

  const betsTable = new Table(stack, "Bets", {
    fields: {
      id: "string",
      userId: "string",
      gameId: "string",
      amountBet: "number",
      outcome: "string",
      outcomeAmount: "number",
      createdAt: "string",
    },
    primaryIndex: { partitionKey: "id" },
    globalIndexes: {
      byUser: { partitionKey: "userId", sortKey: "createdAt" },
      byGame: { partitionKey: "gameId", sortKey: "createdAt" },
      byOutcome: { partitionKey: "outcome", sortKey: "createdAt" },
      byOutcomeAmount: { partitionKey: "outcomeAmount", sortKey: "createdAt" },
      byAmountBet: { partitionKey: "amountBet", sortKey: "createdAt" },
    },
    cdk: {
      table: {
        removalPolicy: removeOnDelete ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
      },
    },
  });

  return {
    betsTableArn: betsTable.tableArn,
    betsTableName: betsTable.tableName,
  };
}
