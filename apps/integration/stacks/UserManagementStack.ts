import { StackContext, Api, Table, Config } from "sst/constructs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export function UserManagementHandlerAPI({ stack }: StackContext) {
  const userTable = new Table(stack, "users", {
    fields: {
      userId: "string",
      discord: "string",
      createdAt: "string",
      updatedAt: "string",
      level: "number",
      walletAddress: "string",
    },
    primaryIndex: { partitionKey: "userId" },
    globalIndexes: {
      walletAddressIndex: {
        partitionKey: "walletAddress",
      },
    },
  });

  const TEST_SECRET = new Config.Secret(stack, "TEST_SECRET");

  const api = new Api(stack, "UserManagementApi", {
    defaults: {
      function: {
        timeout: 20,
      },
    },
    routes: {
      "POST /authorize": {
        function: {
          handler: "packages/functions/src/userManagement/handlers/authorize.handler",
          bind: [TEST_SECRET],
          environment: { TABLE_NAME: userTable.tableName },
        },
      },
      "POST /user": {
        function: {
          handler: "packages/functions/src/userManagement/handlers/createUser.handler",
          permissions: [
            new PolicyStatement({
              actions: ["dynamodb:PutItem"],
              resources: [userTable.tableArn],
            }),
          ],
          bind: [userTable],
          environment: { TABLE_NAME: userTable.tableName },
        },
      },
      "GET /user": {
        function: {
          handler: "packages/functions/src/userManagement/handlers/getUser.handler",
          permissions: [
            new PolicyStatement({
              actions: ["dynamodb:GetItem"],
              resources: [userTable.tableArn],
            }),
          ],
          bind: [userTable],
          environment: { TABLE_NAME: userTable.tableName },
        },
      },
      "PUT /user": {
        function: {
          handler: "packages/functions/src/userManagement/handlers/updateUser.handler",
          permissions: [
            new PolicyStatement({
              actions: ["dynamodb:UpdateItem"],
              resources: [userTable.tableArn],
            }),
          ],
          bind: [userTable],
          environment: { TABLE_NAME: userTable.tableName },
        },
      },
      "DELETE /user": {
        function: {
          handler: "packages/functions/src/userManagement/handlers/deleteUser.handler",
          permissions: [
            new PolicyStatement({
              actions: ["dynamodb:DeleteItem"],
              resources: [userTable.tableArn],
            }),
          ],
          bind: [userTable],
          environment: { TABLE_NAME: userTable.tableName },
        },
      },
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
