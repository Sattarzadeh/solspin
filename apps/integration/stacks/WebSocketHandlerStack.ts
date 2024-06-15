import { StackContext, Api, Table } from "sst/constructs";

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
      },
    },
    routes: {
      "GET /new-connection": "packages/functions/src/handlers/handleNewConnection.handler",
      "POST /authenticate-user": "packages/functions/src/handlers/authenticateUser.handler",
      "GET /generate-seed": "packages/functions/src/handlers/generateServerSeed.handler",
      "POST /logout": "packages/functions/src/handlers/handleLogout.handler",
      "GET /close-connection": "packages/functions/src/handlers/handleConnectionClose.handler",
      "GET /connection-info": "packages/functions/src/handlers/getConnectionInfo.handler",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    TableName: websocketConnectionsTable.tableName,
  });
}
