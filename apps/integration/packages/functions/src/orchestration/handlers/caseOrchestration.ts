import { APIGatewayProxyHandler } from "aws-lambda";
// import { callIsAuthorized } from "../helpers/isAuthorizedHelper";
// import { callGetBalance } from "../helpers/getBalanceHelper";
import { callGetCase } from "../helpers/getCaseHelper"; // Import the new helper
// import { webSocketPayload } from "../../../../../../websocket-handler/src/";
import { getUserFromWebSocket } from "../helpers/getUserFromWebSocket";
import { performSpin } from "../helpers/performSpinHelper";
import { ConnectionInfo } from "../../../../../../websocket-handler/src/models/connectionInfo";
import { CaseItem } from "../../../../../../game-engine/src/models/case_item_model";
import { ApiHandler } from "sst/node/api";

export const gameOrchestrationHandler = ApiHandler(async (event) => {
  let payload: webSocketPayload;

  try {
    payload = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid JSON format" }),
    };
  }

  const { caseId, clientSeed, sid } = payload;

  if (!caseId || clientSeed === undefined || !sid) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "caseId, clientSeed, or sid is missing",
      }),
    };
  }

  try {
    // Call the isAuthorized Lambda function
    const user: ConnectionInfo = await getUserFromWebSocket(sid);

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

    const userId = user.userId;

    const serverSeed = user.serverSeed;

    // Call the getCaseHandler Lambda function to retrieve case details
    const caseData = await callGetCase(caseId);

    if (caseData.statusCode !== 200) {
      throw new Error("Failed to fetch case details");
    }

    const casePrice = JSON.parse(caseData.body).casePrice;

    // Call the getBalance Lambda function
    // const balancePayload = await callGetBalance(userId);
    const balancePayload = {
      balance: 300,
    };
    if (balancePayload.balance >= casePrice) {
      // If balance is sufficient, perform spin

      const caseItem: CaseItem = await performSpin(caseId, clientSeed, serverSeed);

      let newBalance = balancePayload.balance - casePrice;
      newBalance = balancePayload.balance + caseItem.price;

      // Record bet and send to front end for live drop feed

      return {
        statusCode: 200,
        body: JSON.stringify({
          caseItem,
          newBalance,
        }),
      };

      // Spin here
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
