import { StackContext, WebSocketApi, use } from "sst/constructs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { WebSocketHandlerAPI } from "./WebSocketHandlerStack";
import { GameEngineHandlerAPI } from "./GameEngineStack";
export function WebSocketGateway({ stack }: StackContext) {
  const { getConnectionFunction, websocketTable } = use(WebSocketHandlerAPI);
  const { casesTable, getCaseFunction, performSpinFunction } = use(GameEngineHandlerAPI);

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
          handler: "packages/functions/src/websocket-handler/handlers/handleNewConnection.handler",
          timeout: 10,
          permissions: [
            new PolicyStatement({
              actions: ["dynamodb:PutItem"],
              resources: [websocketTable.tableArn],
            }),
          ],
          environment: { TABLE_NAME: websocketTable.tableName },
        },
      },
      $default: "src/default.main",
      $disconnect: {
        function: {
          handler:
            "packages/functions/src/websocket-handler/handlers/handleConnectionClose.handler",
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
          handler: "packages/functions/src/websocket-handler/handlers/handleLogout.handler",
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
          handler: "packages/functions/src/websocket-handler/handlers/generateServerSeed.handler",
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
          handler: "packages/functions/src/websocket-handler/handlers/authenticateUser.handler",
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

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
