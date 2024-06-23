import { Api, StackContext, use } from "sst/constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import { DatabaseStack } from "./Database";

export function ApiStack({ stack }: StackContext) {
  const { walletsTableArn, transactionsTableArn } = use(DatabaseStack);

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
          WALLETS_TABLE_ARN: walletsTableArn,
          TRANSACTIONS_TABLE_ARN: transactionsTableArn,
        },
      },
    },
    routes: {
      "POST /wallets": {
        function: {
          handler: "src/service/api/handler/create-wallet.handler",
          permissions: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ["dynamodb:PutItem"],
              resources: [walletsTableArn],
            }),
          ],
        },
      },
      "GET /wallets/{userId}": {
        function: {
          handler: "src/service/api/handler/get-wallet-by-id.handler",
          permissions: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ["dynamodb:GetItem"],
              resources: [walletsTableArn],
            }),
          ],
        },
      },
      "POST /wallets/deposit": {
        function: {
          handler: "src/service/api/handler/deposit-to-wallet.handler",
          permissions: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ["dynamodb:UpdateItem", "dynamodb:PutItem"],
              resources: [walletsTableArn],
            }),
          ],
        },
      },
      "POST /wallets/withdraw": {
        function: {
          handler: "src/service/api/handler/withdraw-from-wallet.handler",
          permissions: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ["dynamodb:UpdateItem", "dynamodb:PutItem"],
              resources: [walletsTableArn],
            }),
          ],
        },
      },
      "POST /wallets/update-balance": {
        function: {
          handler: "src/service/api/handler/update-balance.handler",
          permissions: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ["dynamodb:UpdateItem"],
              resources: [walletsTableArn],
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
