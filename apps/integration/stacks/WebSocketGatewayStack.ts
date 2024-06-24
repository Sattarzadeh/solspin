import { StackContext, WebSocketApi, use, Cron } from "sst/constructs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { WebSocketHandlerAPI } from "./WebSocketHandlerStack";
import { GameEngineHandlerAPI } from "./GameEngineStack";
import { UserManagementHandlerAPI } from "./UserManagementStack";
import * as cdk from "aws-cdk-lib";

export function WebSocketGateway({ stack }: StackContext) {
  const { getConnectionFunction, websocketTable } = use(WebSocketHandlerAPI);
  const { casesTable, getCaseFunction, performSpinFunction } = use(GameEngineHandlerAPI);
  const { callAuthorizerFunction } = use(UserManagementHandlerAPI);

  const eventBusArn = `arn:aws:events:eu-west-2:816229756125:event-bus/mehransattarzadeh-base-infrastructure-EventBus`;

  callAuthorizerFunction.attachPermissions(["lambda:InvokeFunction"]);
  getConnectionFunction.attachPermissions(["lambda:InvokeFunction"]);
  getCaseFunction.attachPermissions(["lambda:InvokeFunction"]);

  // Attach permissions to publish events to the EventBus
  const eventBusPolicy = new PolicyStatement({
    actions: ["events:PutEvents"],
    resources: [eventBusArn],
  });

  const api = new WebSocketApi(stack, "WebSocketGatewayApi", {
    defaults: {
      function: {
        timeout: 20,
      },
    },
    routes: {
      $connect: {
        function: {
          handler: "packages/functions/src/websocket/handler/handleNewConnection.handler",
          timeout: 10,
          permissions: [
            new PolicyStatement({
              actions: ["dynamodb:PutItem", "dynamodb:DeleteItem"],
              resources: [websocketTable.tableArn],
            }),
            eventBusPolicy,
          ],
          environment: {
            TABLE_NAME: websocketTable.tableName,
            EVENT_BUS_NAME: eventBusArn,
          },
        },
      },
      $default: {
        function: {
          handler: "packages/functions/src/websocket/handler/closeConnection.handler",
          timeout: 10,
        },
      },
      $disconnect: {
        function: {
          handler: "packages/functions/src/websocket/handler/handleConnectionClose.handler",
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
          handler: "packages/functions/src/websocket/handler/handleLogout.handler",
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
      "generate-seed": {
        function: {
          handler: "packages/functions/src/websocket/handler/generateServerSeed.handler",
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
          handler: "packages/functions/src/websocket/handler/authenticateUser.handler",
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
      "case-spin": {
        function: {
          handler: "packages/functions/src/orchestration/handlers/case-orchestration.handler",
          timeout: 10,
          permissions: [
            new PolicyStatement({
              actions: ["lambda:InvokeFunction", "dynamodb:GetItem", "events:PutEvents"],
              resources: [
                casesTable.tableArn,
                getConnectionFunction.functionArn,
                getCaseFunction.functionArn,
                performSpinFunction.functionArn,
                eventBusArn, // Allow publishing to EventBus
              ],
            }),
          ],
          environment: {
            TABLE_NAME: casesTable.tableName,
            GET_USER_FROM_WEBSOCKET_FUNCTION_NAME: getConnectionFunction.functionName,
            GET_CASE_FUNCTION_NAME: getCaseFunction.functionName,
            PERFORM_SPIN_FUNCTION_NAME: performSpinFunction.functionName,
            EVENT_BUS_NAME: eventBusArn,
          },
        },
      },
    },
  });

  const matches = api.url.match(/^wss?:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  const domainName = `${matches && matches[1]}/${stack.stage}`;

  const pruneConnectionCRON = new Cron(stack, "PruneConnectionsCron", {
    schedule: "rate(1 minute)",
    job: {
      function: {
        handler: "packages/functions/src/websocket/handler/pruneConnections.handler",
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
