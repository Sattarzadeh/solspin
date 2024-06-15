import { StackContext, Api, Table } from "sst/constructs";

export function API({ stack }: StackContext) {
  const sessionsTable = new Table(stack, "Sessions", {
    fields: {
      sessionId: "string",
      userId: "string",
      createdAt: "string",
      serverSeed: "string",
      expiresAt: "number",
    },
    primaryIndex: { partitionKey: "sessionId" },
    timeToLiveAttribute: "expireAt",
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [sessionsTable],
      },
    },
    routes: {
      "POST /api/session": "packages/functions/src/handlers/createSession.handler",
      "GET /api/session": "packages/functions/src/handlers/getSession.handler",
      "DELETE /api/session": "packages/functions/src/deleteSession.handler",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
