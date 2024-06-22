import { Api, StackContext } from "sst/constructs";

export function api({ stack }: StackContext) {
  // Create a new API
  const api = new Api(stack, "Api", {
    routes: {
      "POST /bets/record/{userId}": "packages/functions/src/recordBet.handler",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
