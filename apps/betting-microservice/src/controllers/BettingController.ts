import { errorHandler } from '@shared-errors/ErrorHandler';
import { InvalidInputError } from '@shared-errors/InvalidInputError';
import { BettingService } from '../services/BettingService';
import { Request, Response } from 'express';

class BettingController {
  private bettingService: BettingService;

  constructor(bettingService: BettingService) {
    this.bettingService = bettingService;
    this.recordBet = this.recordBet.bind(this);
    this.getBets = this.getBets.bind(this);
  }

  async recordBet(req: Request, res: Response) {
    try {
      const userId = req.params.userId;

      const { amountBet, outcomeAmount, outcome, gameId, walletCurrency } =
        req.body;

      if (
        !amountBet ||
        !outcomeAmount ||
        !outcome ||
        !gameId ||
        !walletCurrency
      ) {
        throw new InvalidInputError('Missing required fields');
      }

      await this.bettingService.recordBet(
        userId,
        gameId,
        amountBet,
        outcomeAmount,
        outcome,
        walletCurrency
      );

      res.status(200).json('Bet recorded').send();
    } catch (error) {
      console.log('error', error);
      errorHandler(error, res);
    }
  }

  async getBets(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const betId = req.query.betId;

      if (!userId) {
        throw new InvalidInputError('Missing required fields');
      }

      if (betId) {
        const bet = await this.bettingService.getBet(userId, betId as string);
        res.status(200).json(bet).send();
        return;
      }

      const bets = await this.bettingService.getBetHistory(userId);

      res.status(200).json(bets).send();
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export default BettingController;
