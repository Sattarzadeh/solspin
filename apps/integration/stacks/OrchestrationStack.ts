import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { StackContext, Api, use, Function } from "sst/constructs";
import { GameEngineHandlerAPI } from "./GameEngineStack";
import { WebSocketHandlerAPI } from "./WebSocketHandlerStack";
export function OrchestrationStack({ stack }: StackContext) {
  const { getConnectionFunction, websocketTable } = use(WebSocketHandlerAPI);
  const { getCaseFunction, casesTable, performSpinFunction } = use(GameEngineHandlerAPI);

  const invokeGetConnectionFunction = new Function(stack, "invokeGetConnectionFunction", {
    handler: "src/caseOrchestration.handler",
    environment: {
      GET_USER_FROM_WEBSOCKET_FUNCTION_NAME: getConnectionFunction.functionName,
      TABLE_NAME: websocketTable.tableName,
    },
  });

  invokeGetConnectionFunction.attachPermissions("*");

  const invokeGetCaseFunction = new Function(stack, "invokeGetCaseFunction", {
    handler: "src/caseOrchestration.handler",
    environment: {
      GET_CASE_FUNCTION_NAME: getCaseFunction.functionName,
      TABLE_NAME: casesTable.tableName,
    },
  });
  invokeGetCaseFunction.attachPermissions("*");

  const invokePerformSpinFunction = new Function(stack, "invokePerformSpinFunction", {
    handler: "src/caseOrchestration.handler",
    environment: {
      PERFORM_SPIN_FUNCTION_NAME: performSpinFunction.functionName,
      TABLE_NAME: casesTable.tableName,
    },
  });
  invokePerformSpinFunction.bind([casesTable]);
  invokePerformSpinFunction.attachPermissions("*");

  const api = new Api(stack, "OrchestrationApi", {
    defaults: {
      function: {
        environment: {
          GET_USER_FROM_WEBSOCKET_FUNCTION_NAME: getConnectionFunction.functionName,
          GET_CASE_FUNCTION_NAME: getCaseFunction.functionName,
          PERFORM_SPIN_FUNCTION_NAME: performSpinFunction.functionName,
        },
        permissions: [
          new PolicyStatement({
            actions: ["lambda:InvokeFunction", "dynamodb:*"],
            resources: [`arn:aws:lambda:${stack.region}:${stack.account}:function:*`],
          }),
        ],
      },
    },
    routes: {
      "POST /spin": "packages/functions/src/orchestration/handlers/caseOrchestration.handler",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
