import { Api, StackContext, Table } from "sst/constructs";
import { RemovalPolicy } from "aws-cdk-lib";

export function ApiStack({ stack }: StackContext) {
  const removeOnDelete = stack.stage !== "prod";
  // Create a DynamoDB table
  const votes_table = new Table(stack, "Votes", {
    fields: {
      what: "string",
      count: "number",
    },
    primaryIndex: { partitionKey: "what" },
    cdk: {
      table: {
        removalPolicy: removeOnDelete ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
      },
    },
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [votes_table],
      },
    },
    routes: {
      "POST /bets/{userId}": "src/services/api/functions/bet.handler",
      "GET /bets/{userId}": "src/services/api/functions/betHistory.handler",
    },
  });

  // Show the endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
