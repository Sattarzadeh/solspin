import { GameOutcome } from '../models/Bet';
import { InvalidInputError } from '@shared-errors/InvalidInputError';
import { createTransactionForBet } from '../remote/WalletRemote';
import { getBet, getBetHistory, recordBet } from '../repository/Repository';

export const saveBet = async (
  userId: string,
  gameId: string,
  amountBet: number,
  outcomeAmount: number,
  outcome: string
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
  await createTransactionForBet(userId, netGain);

  console.log('Recording bet...');
  await recordBet(
    userId,
    amountBet,
    outcome as GameOutcome,
    outcomeAmount,
    gameId
  );
};

export const retrieveBetHistory = async (userId: string) => {
  const bets = await getBetHistory(userId);

  return bets;
};

export const retrieveBet = async (userId: string, betId: string) => {
  const bet = await getBet(userId, betId);

  return bet;
};
