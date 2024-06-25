import { StackContext, WebSocketApi, use, Cron } from "sst/constructs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { WebSocketHandlerAPI } from "./WebSocketHandlerStack";
import { GameEngineHandlerAPI } from "../../game-engine/stacks/GameEngineStack";
import { UserManagementHandlerAPI } from "../../user-management/stacks/UserManagementStack";
import { ApiStack } from "../../wallet/stacks/Api";
import * as cdk from "aws-cdk-lib";

export function WebSocketGateway({ stack }: StackContext) {
  const { getConnectionFunction, websocketTable } = use(WebSocketHandlerAPI);
  const { casesTable, getCaseFunction, performSpinFunction } = use(GameEngineHandlerAPI);
  const { callAuthorizerFunction } = use(UserManagementHandlerAPI);
  const { betTransactionHandler } = use(ApiStack);

  const eventBusArn = cdk.Fn.importValue(`EventBusArn--${stack.stage}`);
  const existingEventBus = cdk.aws_events.EventBus.fromEventBusArn(
    stack,
    "solspin-event-bus",
    eventBusArn
  );
  new cdk.aws_events.Rule(stack, "GameOutcomeRule", {
    eventBus: existingEventBus,
    eventPattern: {
      source: ["orchestration_service.GameOutcome"],
      detailType: ["GameOutcome"],
    },
  });

  callAuthorizerFunction.attachPermissions(["lambda:InvokeFunction"]);
  getConnectionFunction.attachPermissions(["lambda:InvokeFunction"]);
  getCaseFunction.attachPermissions(["lambda:InvokeFunction"]);
  betTransactionHandler.attachPermissions(["lambda:InvokeFunction"]);

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
          handler: "src/handlers/handleNewConnection.handler",
          timeout: 10,
          permissions: [
            new PolicyStatement({
              actions: ["dynamodb:PutItem", "dynamodb:DeleteItem"],
              resources: [websocketTable.tableArn],
            }),
          ],
          environment: {
            TABLE_NAME: websocketTable.tableName,
          },
        },
      },
      $default: {
        function: {
          handler: "src/handlers/closeConnection.handler",
          timeout: 10,
        },
      },
      $disconnect: {
        function: {
          handler: "src/handlers/handleConnectionClose.handler",
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
          handler: "src/handlers/handleLogout.handler",
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
          handler: "src/handlers/generateServerSeed.handler",
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
          handler: "src/handlers/authenticateUser.handler",
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
          handler: "src/handlers/case-orchestration.handler",
          timeout: 10,
          permissions: [
            new PolicyStatement({
              actions: ["lambda:InvokeFunction", "dynamodb:GetItem", "events:PutEvents"],
              resources: [
                casesTable.tableArn,
                getConnectionFunction.functionArn,
                getCaseFunction.functionArn,
                performSpinFunction.functionArn,
                betTransactionHandler.functionArn,
                eventBusArn,
              ],
            }),
          ],
          environment: {
            TABLE_NAME: casesTable.tableName,
            GET_USER_FROM_WEBSOCKET_FUNCTION_NAME: getConnectionFunction.functionName,
            GET_CASE_FUNCTION_NAME: getCaseFunction.functionName,
            PERFORM_SPIN_FUNCTION_NAME: performSpinFunction.functionName,
            EVENT_BUS_ARN: eventBusArn,
            BET_TRANSACTION_FUNCTION_NAME: betTransactionHandler.functionName,
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
        handler: "src/handlers/pruneConnections.handler",
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
