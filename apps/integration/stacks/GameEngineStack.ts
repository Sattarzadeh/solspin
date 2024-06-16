import { StackContext, Api, Table } from "sst/constructs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
export function GameEngineHandlerAPI({ stack }: StackContext) {
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

  const api = new Api(stack, "GameEngineApi", {
    defaults: {
      function: {
        environment: {
          TABLE_NAME: casesTable.tableName,
        },
        bind: [casesTable],
        permissions: [
          new PolicyStatement({
            actions: ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:DeleteItem"],
            resources: [casesTable.tableArn],
          }),
        ],
      },
    },

    routes: {
      "GET /case": "packages/functions/src/gameEngineHandlers/getCase.handler",
      "GET /cases": "packages/functions/src/gameEngineHandlers/getAllCases.handler",
      "GET /initialize": "packages/functions/src/gameEngineHandlers/initializeDatabase.handler",
      "POST /spin": "packages/functions/src/gameEngineHandlers/spin.handler",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    TableName: casesTable.tableName,
  });
}
