import { ConnectionInfo } from "@solspin/websocket-types";
import { CaseItem, Case } from "@solspin/game-engine-types";
import { getUserFromWebSocket } from "../helpers/getUserFromWebSocket";
import { callGetCase } from "../helpers/getCaseHelper";
import { performSpin } from "../helpers/performSpinHelper";
import { WebSocketApiHandler } from "sst/node/websocket-api";
import logger from "@solspin/logger";
import { sendWebSocketMessage } from "@solspin/web-socket-message";
import { WebSocketOrchestrationPayloadSchema } from "@solspin/websocket-types";
import { ZodError } from "zod";
import { publishEvent, GameResult, EventConfig } from "@solspin/events";
import { Service } from "@solspin/types";
import { GameOutcome } from "@solspin/betting-types";

export const handler = WebSocketApiHandler(async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Request body is missing" }),
    };
  }
  logger.info("Orchestration service was initiated with event body: ", event.body);

  const parsedBody = JSON.parse(event.body || "{}");

  let payload;
  try {
    payload = WebSocketOrchestrationPayloadSchema.parse(parsedBody);
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error("Validation error in WebSocket orchestration payload", { error });
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Validation Error",
          errors: error.errors,
        }),
      };
    }
    throw error;
  }
  try {
    const { caseId, clientSeed } = payload;
    const connectionId = event.requestContext.connectionId;
    const { stage, domainName } = event.requestContext;
    if (!clientSeed || !connectionId || !caseId) {
      logger.error(`clientSeed or connectionId is missing`);
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "caseId, clientSeed, or connectionId is missing",
        }),
      };
    }

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
    logger.info(`Received connection info from getUserFromWebSocket lambda.`);

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
    const userId = user.userId;
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
      const outcome =
        caseModel.casePrice < caseRolledItem.price
          ? GameOutcome.WIN
          : caseModel.casePrice > caseRolledItem.price
          ? GameOutcome.LOSE
          : GameOutcome.NEUTRAL;
      let newBalance = balancePayload.balance - caseModel.casePrice;
      const outcomeAmount = newBalance + caseRolledItem.price;

      logger.info("Event published with data: ", {
        userId,
        gameType: GameResult.GameType.CASES,
        amountBet: caseModel.casePrice,
        outcome,
        outcomeAmount,
        timestamp: new Date().toISOString(),
      });
      publishEvent(
        GameResult.gameResultEvent,
        {
          userId,
          gameType: GameResult.GameType.CASES,
          amountBet: caseModel.casePrice,
          outcome,
          outcomeAmount,
          timestamp: new Date().toISOString(),
        } as GameResult.GameResultType,
        Service.ORCHESTRATION as unknown as EventConfig
      );

      const responseMessage = {
        caseRolledItem,
        newBalance,
      };

      try {
        const messageEndpoint = `${domainName}/${stage}`;
        await sendWebSocketMessage(messageEndpoint, connectionId, responseMessage);
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
