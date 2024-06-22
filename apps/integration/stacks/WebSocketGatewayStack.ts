import { StackContext, WebSocketApi, use, Cron } from "sst/constructs";
import { PolicyStatement, User } from "aws-cdk-lib/aws-iam";
import { WebSocketHandlerAPI } from "./WebSocketHandlerStack";
import { GameEngineHandlerAPI } from "./GameEngineStack";
import { UserManagementHandlerAPI } from "./UserManagementStack";
export function WebSocketGateway({ stack }: StackContext) {
  const { getConnectionFunction, websocketTable } = use(WebSocketHandlerAPI);
  const { casesTable, getCaseFunction, performSpinFunction } = use(GameEngineHandlerAPI);
  const { callAuthorizerFunction } = use(UserManagementHandlerAPI);

  callAuthorizerFunction.attachPermissions(["lambda:InvokeFunction"]);
  getConnectionFunction.attachPermissions(["lambda:InvokeFunction"]);
  getCaseFunction.attachPermissions(["lambda:InvokeFunction"]);

  const api = new WebSocketApi(stack, "WebSocketGatewayApi", {
    defaults: {
      function: {
        timeout: 20,
      },
    },
    routes: {
      $connect: {
        function: {
          handler: "packages/functions/src/websocket/handlers/handleNewConnection.handler",
          timeout: 10,
          permissions: [
            new PolicyStatement({
              actions: ["dynamodb:PutItem", "dynamodb:DeleteItem"],
              resources: [websocketTable.tableArn],
            }),
          ],
          environment: { TABLE_NAME: websocketTable.tableName },
        },
      },
      $default: {
        function: {
          handler: "packages/functions/src/websocket/handlers/closeConnection.handler",
          timeout: 10,
        },
      },
      $disconnect: {
        function: {
          handler: "packages/functions/src/websocket/handlers/handleConnectionClose.handler",
          timeout: 10,
          permissions: [
            new PolicyStatement({
              actions: ["dynamodb:DeleteItem"],
              resources: [websocketTable.tableArn],
            }),
          ],
          environment: { TABLE_NAME: websocketTable.tableName },
        },
      },
      logout: {
        function: {
          handler: "packages/functions/src/websocket/handlers/handleLogout.handler",
          timeout: 10,
          permissions: [
            new PolicyStatement({
              actions: ["dynamodb:PutItem", "dynamodb:GetItem"],
              resources: [websocketTable.tableArn],
            }),
          ],
          environment: { TABLE_NAME: websocketTable.tableName },
        },
      },
      generateSeed: {
        function: {
          handler: "packages/functions/src/websocket/handlers/generateServerSeed.handler",
          timeout: 10,
          permissions: [
            new PolicyStatement({
              actions: ["dynamodb:PutItem", "dynamodb:GetItem"],
              resources: [websocketTable.tableArn],
            }),
          ],
          environment: { TABLE_NAME: websocketTable.tableName },
        },
      },
      authenticate: {
        function: {
          handler: "packages/functions/src/websocket/handlers/authenticateUser.handler",
          timeout: 10,
          permissions: [
            new PolicyStatement({
              actions: ["dynamodb:PutItem", "dynamodb:GetItem", "lambda:InvokeFunction"],
              resources: [websocketTable.tableArn, callAuthorizerFunction.functionArn],
            }),
          ],
          environment: {
            TABLE_NAME: websocketTable.tableName,
            AUTHORIZER_FUNCTION_NAME: callAuthorizerFunction.functionName,
          },
        },
      },
      caseSpin: {
        function: {
          handler: "packages/functions/src/orchestration/handlers/caseOrchestration.handler",
          timeout: 10,
          permissions: [
            new PolicyStatement({
              actions: ["lambda:InvokeFunction", "dynamodb:GetItem"],
              resources: [
                casesTable.tableArn,
                getConnectionFunction.functionArn,
                getCaseFunction.functionArn,
                performSpinFunction.functionArn,
              ],
            }),
          ],
          environment: {
            TABLE_NAME: casesTable.tableName,
            GET_USER_FROM_WEBSOCKET_FUNCTION_NAME: getConnectionFunction.functionName,
            GET_CASE_FUNCTION_NAME: getCaseFunction.functionName,
            PERFORM_SPIN_FUNCTION_NAME: performSpinFunction.functionName,
          },
        },
      },
    },
  });
  const matches = api.url.match(/^wss?:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  const domainName = `${matches && matches[1]}/${stack.stage}`;
  const pruneConnectionCRON = new Cron(stack, "PruneConnectionsCron", {
    schedule: "rate(10 minutes)",
    job: {
      function: {
        handler: "packages/functions/src/websocket/handlers/pruneConnections.handler",
        permissions: ["dynamodb:Scan", "dynamodb:DeleteItem", "execute-api:ManageConnections"],
        environment: {
          TABLE_NAME: websocketTable.tableName,
          DOMAIN: domainName,
        },
      },
    },
  });

  pruneConnectionCRON.attachPermissions([
    "dynamodb:Scan",
    "dynamodb:DeleteItem",
    "execute-api:ManageConnections",
  ]);

  pruneConnectionCRON.bind([websocketTable]);

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
