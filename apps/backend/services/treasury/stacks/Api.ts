import { Api, StackContext, use } from "sst/constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import { DatabaseStack } from "./Database";

export function ApiStack({ stack }: StackContext) {
  const { transactionsTableArn } = use(DatabaseStack);

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
          TRANSACTIONS_TABLE_NAME: transactionsTableArn,
          SOLANA_RPC_URL: process.env.SOLANA_RPC_URL || "",
          HOUSE_WALLET_ADDRESS: process.env.HOUSE_WALLET_ADDRESS || "",
          HOUSE_SECRET_KEY: process.env.HOUSE_SECRET_KEY || "",
          FEE: process.env.TRANSACTION_FEE || "5000",
          COMMITMENT_LEVEL: process.env.COMMITMENT_LEVEL || "finalized",
        },
      },
    },
    routes: {
      "POST /treasury/deposit": {
        function: {
          handler: "src/service/api/handler/deposit-to-wallet.handler",
          permissions: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ["dynamodb:PutItem"],
              resources: [transactionsTableArn],
            }),
          ],
        },
      },
      "POST /treasury/withdraw": {
        function: {
          handler: "src/service/api/handler/withdraw-from-wallet.handler",
          permissions: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ["dynamodb:PutItem"],
              resources: [transactionsTableArn],
            }),
          ],
        },
      },
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
