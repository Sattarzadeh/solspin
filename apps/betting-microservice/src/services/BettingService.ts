import { GameOutcome } from '../models/Bet';
import { InvalidInputError } from '@shared-errors/InvalidInputError';
import { RemoteService } from '../services/RemoteService';
import { DatabaseHandlerService } from '../services/DatabaseHandlerService';
import { Currency } from '@shared-types/shared-types';

export class BettingService {
  private remoteService: RemoteService;
  private databaseHandlerService: DatabaseHandlerService;

  constructor(
    remoteService: RemoteService,
    databaseHandlerService: DatabaseHandlerService
  ) {
    this.remoteService = remoteService;
    this.databaseHandlerService = databaseHandlerService;
  }

  public recordBet = async (
    userId: string,
    gameId: string,
    amountBet: number,
    outcomeAmount: number,
    outcome: string,
    walletCurrency: Currency
  ): Promise<void> => {
    if (!userId || !gameId || !amountBet || !outcomeAmount || !outcome) {
      throw new InvalidInputError('Missing required fields');
    }

    if (amountBet < 0 || outcomeAmount < 0) {
      throw new InvalidInputError('Invalid bet amount');
    }

    if (outcome !== GameOutcome.WIN && outcome !== GameOutcome.LOSE) {
      throw new InvalidInputError('Invalid outcome');
    }

    const netGain = outcomeAmount - amountBet;

    console.log('Creating transaction for bet...', userId, netGain, gameId);
    await this.remoteService.createTransactionForBet(
      userId,
      netGain,
      walletCurrency
    );

    console.log('Recording bet...');
    await this.databaseHandlerService.recordBet(
      userId,
      amountBet,
      outcome as GameOutcome,
      outcomeAmount,
      gameId
    );
  };

  public getBetHistory = async (userId: string) => {
    const bets = await this.databaseHandlerService.getBetHistory(userId);

    return bets;
  };

  public getBet = async (userId: string, betId: string) => {
    const bet = await this.databaseHandlerService.getBet(userId, betId);

    return bet;
  };
}
