import { errorHandler, InvalidInputError } from "@solspin/errors";
import { Request, Response } from "express";
import { retrieveBet, retrieveBetHistory, saveBet } from "../services/BettingService";

class BettingController {
  async recordBetController(req: Request, res: Response) {
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
  }

  async getBetsController(req: Request, res: Response) {
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
  }
}

export default BettingController;
