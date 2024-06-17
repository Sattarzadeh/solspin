import { ConnectionInfo } from "@solspin/websocket-types";
import { CaseItem, Case } from "@solspin/game-engine-types"; // Assuming CaseModel type is defined here
import { WebSocketOrchestrationPayload } from "@solspin/websocket-types";
import { getUserFromWebSocket } from "../helpers/getUserFromWebSocket";
import { callGetCase } from "../helpers/getCaseHelper";
import { performSpin } from "../helpers/performSpinHelper";
import { WebSocketApiHandler } from "sst/node/websocket-api";
import { ApiGatewayManagementApi } from "aws-sdk";

export const handler = WebSocketApiHandler(async (event) => {
  console.time("TotalExecutionTime");

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Request body is missing" }),
    };
  }
  console.log(event.body);

  let payload: WebSocketOrchestrationPayload;
  try {
    payload = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid JSON format" }),
    };
  }

  const { caseId, clientSeed } = payload;
  const connectionId = event.requestContext?.connectionId;
  const { stage, domainName } = event.requestContext;

  if (!caseId || clientSeed === undefined || !connectionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "caseId, clientSeed, or connectionId is missing",
      }),
    };
  }

  const apiG = new ApiGatewayManagementApi({
    endpoint: `${domainName}/${stage}`,
  });

  try {
    console.time("getUserFromWebSocket");
    const connectionInfoPayload = await getUserFromWebSocket(connectionId);
    console.timeEnd("getUserFromWebSocket");

    let user: ConnectionInfo;
    try {
      user = JSON.parse(connectionInfoPayload.body).connectionInfo;
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid JSON format" }),
      };
    }
    console.log(user);
    if (!user || !user.isAuthenticated) {
      return {
        statusCode: 403,
        body: JSON.stringify({ isAuthorized: false, message: "Unauthenticated" }),
      };
    }

    if (!user.serverSeed) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Server seed is missing. Please request a server seed before opening a case.",
        }),
      };
    }
    const serverSeed = user.serverSeed;

    console.time("callGetCase");
    const caseData = await callGetCase(caseId);
    console.timeEnd("callGetCase");

    if (caseData.statusCode !== 200) {
      throw new Error("Failed to fetch case details");
    }

    const caseModel: Case = JSON.parse(caseData.body);

    const balancePayload = {
      balance: 300,
    };

    if (balancePayload.balance >= caseModel.casePrice) {
      console.time("performSpin");
      const caseRollResult = await performSpin(caseModel, clientSeed, serverSeed);
      console.timeEnd("performSpin");

      const caseRolledItem: CaseItem = JSON.parse(caseRollResult.body);

      let newBalance = balancePayload.balance - caseModel.casePrice;
      newBalance += caseRolledItem.price;

      const responseMessage = {
        caseRolledItem,
        newBalance,
      };

      try {
        await apiG
          .postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify(responseMessage),
          })
          .promise();
      } catch (error) {
        console.error("Error posting to connection:", error);
      }

      console.timeEnd("TotalExecutionTime");
      return {
        statusCode: 200,
        body: JSON.stringify(responseMessage),
      };
    } else {
      console.timeEnd("TotalExecutionTime");
      return {
        statusCode: 403,
        body: JSON.stringify({
          isAuthorized: true,
          message: "Insufficient balance",
        }),
      };
    }
  } catch (error) {
    console.error("Error in orchestration handler:", error);
    console.timeEnd("TotalExecutionTime");
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
});
