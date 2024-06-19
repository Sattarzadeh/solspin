import { ConnectionInfo } from "@solspin/websocket-types";
import { CaseItem, Case } from "@solspin/game-engine-types"; // Assuming CaseModel type is defined here
import { WebSocketOrchestrationPayload } from "@solspin/websocket-types";
import { getUserFromWebSocket } from "../helpers/getUserFromWebSocket";
import { callGetCase } from "../helpers/getCaseHelper";
import { performSpin } from "../helpers/performSpinHelper";
import { WebSocketApiHandler } from "sst/node/websocket-api";
import { ApiGatewayManagementApi } from "aws-sdk";
import logger from "@solspin/logger";
import { validateUserInput } from "@solspin/validator";

export const handler = WebSocketApiHandler(async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Request body is missing" }),
    };
  }
  logger.info("Orchestration service was initiated with event body: ", event.body);

  let payload: WebSocketOrchestrationPayload;
  try {
    payload = JSON.parse(event.body);
  } catch (error) {
    logger.error(`WebSocketOrchestrationPayload was not in the correct format`);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid JSON format" }),
    };
  }
  try {
    const caseId = validateUserInput(payload.caseId, "uuid");
    const clientSeed = validateUserInput(payload.clientSeed, "alphanumeric");
    const connectionId = event.requestContext.connectionId;
    const { stage, domainName } = event.requestContext;

    if (!caseId || !clientSeed || !connectionId) {
      logger.error(`caseId, clientSeed, or connectionId is missing`);
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
    logger.info("Invoking getUserFromWebSocket lambda with connectionId: ", connectionId);
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
    logger.info(
      `Received connection info from getUserFromWebSocket lambda. IsAuthenticated: ${user.isAuthenticated}`
    );
    if (!user || !user.isAuthenticated) {
      logger.error(`User with connectionId: ${connectionId} is unauthenticated`);
      return {
        statusCode: 403,
        body: JSON.stringify({ isAuthorized: false, message: "Unauthenticated" }),
      };
    }

    if (!user.serverSeed) {
      logger.error(`User with connectionId: ${connectionId} has not requested a server seed`);
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Server seed is missing. Please request a server seed before opening a case.",
        }),
      };
    }
    const serverSeed = user.serverSeed;

    logger.info("Invoking getCase lambda with caseId: ", caseId);
    const caseData = await callGetCase(caseId);

    if (caseData.statusCode !== 200) {
      throw new Error("Failed to fetch case details");
    }

    const caseModel: Case = JSON.parse(caseData.body);
    const balancePayload = {
      balance: 300,
    };

    if (balancePayload.balance >= caseModel.casePrice) {
      logger.info(
        `Invoking performSpin lambda with clientSeed: ${clientSeed} and serverSeed: ${serverSeed}`
      );
      const caseRollResult = await performSpin(caseModel, clientSeed, serverSeed);

      const caseRolledItem: CaseItem = JSON.parse(caseRollResult.body);

      logger.info(`Case roll result is: ${caseRollResult}`);
      let newBalance = balancePayload.balance - caseModel.casePrice;
      newBalance += caseRolledItem.price;

      const responseMessage = {
        caseRolledItem,
        newBalance,
      };

      try {
        logger.info(`Sending message to client with connectionId: ${connectionId}`);
        await apiG
          .postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify(responseMessage),
          })
          .promise();
      } catch (error) {
        logger.error("Error posting to connection:", (error as Error).message);
      }

      return {
        statusCode: 200,
        body: JSON.stringify(responseMessage),
      };
    } else {
      logger.error(
        `User with connectionId: ${connectionId} has an insufficient balance. Case price: ${caseModel.casePrice} and balance: ${balancePayload.balance}`
      );
      return {
        statusCode: 403,
        body: JSON.stringify({
          isAuthorized: true,
          message: "Insufficient balance",
        }),
      };
    }
  } catch (error) {
    logger.error("Error in orchestration handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
});
