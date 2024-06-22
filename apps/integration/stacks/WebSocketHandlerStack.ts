import { RemovalPolicy } from "aws-cdk-lib/core";
import { StackContext, Table, Function, use } from "sst/constructs";

export function WebSocketHandlerAPI({ stack }: StackContext) {
  const removeOnDelete = stack.stage !== "prod";
  const websocketConnectionsTable = new Table(stack, "websocket-connections", {
    fields: {
      connectionId: "string",
      userId: "string",
      serverSeed: "string",
      isAuthorized: "binary",
      caseId: "string",
    },
    primaryIndex: { partitionKey: "connectionId" },
    cdk: {
      table: {
        removalPolicy: removeOnDelete ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
      },
    },
  });

  const getConnectionFunction = new Function(stack, "getConnectionFunction", {
    handler: "packages/functions/src/websocket/handlers/getConnectionInfo.handler",
    environment: {
      TABLE_NAME: websocketConnectionsTable.tableName,
    },
  });
  getConnectionFunction.attachPermissions(["lambda:InvokeFunction"]);

  return {
    getConnectionFunction,
    websocketTable: websocketConnectionsTable,
  };
}
