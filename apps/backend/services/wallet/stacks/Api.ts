import { Api, Function, StackContext, use } from "sst/constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cdk from "aws-cdk-lib";
import { DatabaseStack } from "./Database";

export function ApiStack({ stack }: StackContext) {
  const { walletsTableArn } = use(DatabaseStack);
  const eventBusArn = cdk.Fn.importValue(`EventBusArn--${stack.stage}`);

  const existingEventBus = cdk.aws_events.EventBus.fromEventBusArn(
    stack,
    "solspin-event-bus",
    eventBusArn
  );

  const betTransactionHandler = new Function(stack, "BetTransactionHandler", {
    handler: "src/service/event/handler/update-balance.handler",
    environment: {
      WALLETS_TABLE_ARN: walletsTableArn,
    },
    permissions: [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["dynamodb:UpdateItem"],
        resources: [walletsTableArn],
      }),
    ],
  });

  new cdk.aws_events.Rule(stack, "BetTransactionRule", {
    eventBus: existingEventBus,
    eventPattern: {
      source: ["betting_service.BetTransaction"],
      detailType: ["event"],
    },
    targets: [new cdk.aws_events_targets.LambdaFunction(betTransactionHandler)],
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
          WALLETS_TABLE_ARN: walletsTableArn,
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
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
