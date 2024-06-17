import { ConnectionInfo } from "@solspin/websocket-types";
import { CaseItem, Case } from "@solspin/game-engine-types"; // Assuming CaseModel type is defined here
import { WebSocketOrchestrationPayload } from "@solspin/websocket-types";
import { getUserFromWebSocket } from "../helpers/getUserFromWebSocket";
import { callGetCase } from "../helpers/getCaseHelper";
import { performSpin } from "../helpers/performSpinHelper";
import { WebSocketApiHandler } from "sst/node/websocket-api";

export const handler = WebSocketApiHandler(async (event) => {
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
  if (!caseId || clientSeed === undefined || !connectionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "caseId, clientSeed, or connectionId is missing",
      }),
    };
  }

  try {
    // Call the getUserFromWebSocket function
    const connectionInfoPayload = await getUserFromWebSocket(connectionId);
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

    // Call the getCaseHandler Lambda function to retrieve case details
    const caseData = await callGetCase(caseId);

    if (caseData.statusCode !== 200) {
      throw new Error("Failed to fetch case details");
    }

    const caseModel: Case = JSON.parse(caseData.body);

    // Call the getBalance Lambda function
    // const balancePayload = await callGetBalance(user.userId);
    const balancePayload = {
      balance: 300,
    };

    if (balancePayload.balance >= caseModel.casePrice) {
      // If balance is sufficient, perform spin
      const caseRollResult = await performSpin(caseModel, clientSeed, serverSeed);
      const caseRolledItem: CaseItem = JSON.parse(caseRollResult.body);

      let newBalance = balancePayload.balance - caseModel.casePrice;
      newBalance += caseRolledItem.price;

      // save new balance
      // Record bet and send to front end for live drop feed

      return {
        statusCode: 200,
        body: JSON.stringify({
          caseRolledItem,
          newBalance,
        }),
      };
    } else {
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
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
});
