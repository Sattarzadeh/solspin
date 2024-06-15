import { StackContext, Api, Table } from "sst/constructs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
export function API({ stack }: StackContext) {
  const websocketConnectionsTable = new Table(stack, "websocket-connections", {
    fields: {
      connectionId: "string",
      userId: "string",
      serverSeed: "string",
      isAuthorized: "binary",
    },
    primaryIndex: { partitionKey: "connectionId" },
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
          TABLE_NAME: websocketConnectionsTable.tableName,
        },
        bind: [websocketConnectionsTable],
        permissions: [
          new PolicyStatement({
            actions: ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:DeleteItem"],
            resources: [websocketConnectionsTable.tableArn],
          }),
        ],
      },
    },
    routes: {
      "GET /new-connection":
        "packages/functions/src/websocket-handler/handlers/handleNewConnection.handler",
      "POST /authenticate-user":
        "packages/functions/src/websocket-handler/handlers/authenticateUser.handler",
      "GET /generate-seed":
        "packages/functions/src/websocket-handler/handlers/generateServerSeed.handler",
      "POST /logout": "packages/functions/src/handlers/websocket-handler/handleLogout.handler",
      "GET /close-connection":
        "packages/functions/src/websocket-handler/handlers/handleConnectionClose.handler",
      "GET /connection-info":
        "packages/functions/src/websocket-handler/handlers/getConnectionInfo.handler",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    TableName: websocketConnectionsTable.tableName,
  });
}
