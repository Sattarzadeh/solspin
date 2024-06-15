import { errorHandler, InvalidInputError } from "@solspin/errors";
import { Request, Response } from "express";
import { retrieveBet, retrieveBetHistory, saveBet } from "../services/BettingService";
import { ApiHandler } from "sst/node/api";

export const recordBetController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const { amountBet, outcomeAmount, outcome, gameId } = req.body;

    if (!amountBet || !outcomeAmount || !outcome || !gameId) {
      throw new InvalidInputError("Missing required fields");
    }

    await saveBet(userId, gameId, amountBet, outcomeAmount, outcome);

    res.status(200).json("Bet recorded").send();
  } catch (error) {
    console.log("error", error);
    errorHandler(error, res);
  }
};

export const handler = ApiHandler(async (event) => {
  try {
    const userId = event.pathParameters?.userId;
    const { amountBet, outcomeAmount, outcome, gameId } = JSON.parse(event.body || "{}");

    if (!amountBet || !outcomeAmount || !outcome || !gameId || !userId) {
      throw new InvalidInputError("Missing required fields");
    }

    await saveBet(userId, gameId, amountBet, outcomeAmount, outcome);
    return {
      statusCode: 200,
      body: JSON.stringify("Bet recorded"),
    };
  } catch (error) {
    console.log("error", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong" }),
    };
  }
});

export const getBetsController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const betId = req.query.betId;

    if (!userId) {
      throw new InvalidInputError("Missing required fields");
    }

    if (betId) {
      const bet = await retrieveBet(userId, betId as string);
      res.status(200).json(bet).send();
      return;
    }

    const bets = await retrieveBetHistory(userId);

    res.status(200).json(bets).send();
  } catch (error) {
    errorHandler(error, res);
  }
};
