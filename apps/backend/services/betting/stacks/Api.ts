import { Api, StackContext, use } from "sst/constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cdk from "@aws-cdk/core";
import { DatabaseStack } from "./database";

export function ApiStack({ stack }: StackContext) {
  const { betsTableArn } = use(DatabaseStack);
  const eventBusArn = cdk.Fn.importValue(`EventBusArn--${stack.stage}`);

  const api = new Api(stack, "api", {
    routes: {
      "POST /bets": {
        function: {
          handler: "src/create-bet.main",
          permissions: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ["dynamodb:PutItem"],
              resources: [betsTableArn],
            }),
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ["events:PutEvents"],
              resources: [eventBusArn],
            }),
          ],
        },
      },
      "GET /bets/{id}": {
        function: {
          handler: "src/get-bet-by-id.main",
          permissions: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ["dynamodb:GetItem"],
              resources: [betsTableArn],
            }),
          ],
        },
      },
      "GET /bets/{userId}": {
        function: {
          handler: "src/list-bets-by-user-id.main",
          permissions: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ["dynamodb:Query"],
              resources: [betsTableArn, `${betsTableArn}/*`],
            }),
          ],
        },
      },
      "GET /bets/{gameId}": {
        function: {
          handler: "src/list-bets-by-game-id.main",
          permissions: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ["dynamodb:Query"],
              resources: [betsTableArn, `${betsTableArn}/*`],
            }),
          ],
        },
      },
    },
    defaults: {
      function: {
        environment: {
          BETS_TABLE_ARN: betsTableArn,
          EVENT_BUS_ARN: eventBusArn,
        },
      },
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
