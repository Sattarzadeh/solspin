import { Api, StackContext } from "sst/constructs";

export function ApiStack({ stack }: StackContext) {
  const api = new Api(stack, "api", {
    routes: {
      "POST /bets/": "src/service/api/handler/create-bet.handler",
      "GET /bets/{id}": "src/service/api/handler/get-bet-by-id.handler",
      "GET /bets/{userId}": "src/service/api/handler/list-bets-by-user-id.handler",
      "GET /bets/{gameId}": "src/service/api/handler/list-bets-by-game-id.handler",
    },
  });

  // Show the endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
