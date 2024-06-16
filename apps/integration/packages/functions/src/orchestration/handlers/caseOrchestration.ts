import { APIGatewayProxyHandler } from "aws-lambda";
// import { callIsAuthorized } from "../helpers/isAuthorizedHelper";
// import { callGetBalance } from "../helpers/getBalanceHelper";
import { callGetCase } from "../helpers/getCaseHelper"; // Import the new helper
// import { webSocketPayload } from "../../../../../../websocket-handler/src/";
import { getUserFromWebSocket } from "../helpers/getUserFromWebSocket";
import { performSpin } from "../helpers/performSpinHelper";
import { ConnectionInfo } from "../../../../../../websocket-handler/src/models/connectionInfo";
import { CaseItem } from "../../../../../../game-engine/src/models/case_item_model";
// import { WebSocketPayload } from "../../../../../../../@solspin/types/src/service/websocket/types";
import { ApiHandler } from "sst/node/api";

interface WebSocketPayload {
  connectionId: string;
  caseId: string;
  clientSeed: string;
}
export const handler = ApiHandler(async (event) => {
  let payload: WebSocketPayload;
  try {
    payload = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid JSON format" }),
    };
  }

  const { caseId, clientSeed, connectionId } = payload;
  if (!caseId || clientSeed === undefined || !connectionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "caseId, clientSeed, or connectionId is missing",
      }),
    };
  }

  try {
    // Call the isAuthorized Lambda function
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

      const caseRollResult = await performSpin(caseId, clientSeed, serverSeed);
      const caseRolledItem: CaseItem = JSON.parse(caseRollResult.body);
      let newBalance = balancePayload.balance - casePrice;
      newBalance = balancePayload.balance + caseRolledItem.price;
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
