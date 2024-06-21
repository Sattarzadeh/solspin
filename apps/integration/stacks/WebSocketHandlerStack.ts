import { StackContext, Api, Table, Function, use } from "sst/constructs";
import { PolicyStatement, User } from "aws-cdk-lib/aws-iam";
import { UserManagementHandlerAPI } from "./UserManagementStack";
export function WebSocketHandlerAPI({ stack }: StackContext) {
  const { callAuthorizerFunction } = use(UserManagementHandlerAPI);

  callAuthorizerFunction.attachPermissions(["lambda:InvokeFunction"]);
  const websocketConnectionsTable = new Table(stack, "websocket-connections", {
    fields: {
      connectionId: "string",
      userId: "string",
      serverSeed: "string",
      isAuthorized: "binary",
    },
    primaryIndex: { partitionKey: "connectionId" },
  });

  const getConnectionFunction = new Function(stack, "getConnectionFunction", {
    handler: "packages/functions/src/websocket/handlers/getConnectionInfo.handler",
    environment: {
      TABLE_NAME: websocketConnectionsTable.tableName,
    },
  });
  getConnectionFunction.attachPermissions("*");

  // const newConnectionFunction = new Function(stack, "newConnectionFunction", {
  //   handler: "packages/functions/src/websocket-handler/handlers/handleNewConnection.handler",
  //   environment: {
  //     TABLE_NAME: websocketConnectionsTable.tableName,
  //   },
  // });
  // getConnectionFunction.attachPermissions("*");
  const api = new Api(stack, "WebSocketApi", {
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
      "GET /new-connection": "packages/functions/src/w/handlers/handleNewConnection.handler",
      "POST /authenticate-user":
        "packages/functions/src/websocket/handlers/authenticateUser.handler",
      "GET /generate-seed": "packages/functions/src/websocket/handlers/generateServerSeed.handler",
      "POST /logout": "packages/functions/src/websocket/handlers/handleLogout.handler",
      "POST /close-connection":
        "packages/functions/src/websocket/handlers/handleConnectionClose.handler",
      "GET /connection": "packages/functions/src/websocket/handlers/getConnectionInfo.handler",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    TableName: websocketConnectionsTable.tableName,
  });

  return {
    getConnectionFunction,
    websocketTable: websocketConnectionsTable,
  };
}
