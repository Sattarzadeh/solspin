import { StackContext, Api, Table } from "sst/constructs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
export function API({ stack }: StackContext) {
  const casesTable = new Table(stack, "cases", {
    fields: {
      caseId: "string",
      caseType: "string",
      caseName: "string",
      casePrice: "number",
      image_url: "string",
      caseHash: "string",
      items: "string",
      item_prefix_sums: "string",
    },
    primaryIndex: { partitionKey: "caseId" },
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: {
          TABLE_NAME: casesTable.tableName,
        },
        bind: [casesTable],
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
      "POST /logout": "packages/functions/src/websocket-handler/handlers/handleLogout.handler",
      "POST /close-connection":
        "packages/functions/src/websocket-handler/handlers/handleConnectionClose.handler",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    TableName: casesTable.tableName,
  });
}
