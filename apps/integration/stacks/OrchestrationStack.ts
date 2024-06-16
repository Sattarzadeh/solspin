import { StackContext, Api, Table } from "sst/constructs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
export function OrchestrationStack({ stack }: StackContext) {
  const api = new Api(stack, "OrchestrationApi", {
    defaults: {},
    routes: {
      "GET /new-connection":
        "packages/functions/src/websocket-handler/handlers/handleNewConnection.handler",
      "POST /authenticate-user":
        "packages/functions/src/websocket-handler/handlers/authenticateUser.handler",
      "GET /generate-seed":
        "packages/functions/src/websocket-handler/handlers/generateServerSeed.handler",
      "POST /logout": "packages/functions/src/websocket-handler/handlers/handleLogout.handler",
      "POST /close-connection":
        "packages/functions/src/websocket-handler/handlers/handleConnectionClose.handler",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
