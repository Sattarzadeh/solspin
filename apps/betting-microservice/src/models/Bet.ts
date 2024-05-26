export enum GameOutcome {
  WIN = 'WIN',
  LOSE = 'LOSE',
}

export type Bet = {
  user_id: string; //primary key
  bet_id: string; // sort key
  amountBet: number; // how much they bet
  outcome: GameOutcome; // WIN || LOSE
  outcomeAmount: number; // how much they won from the bet
  timestamp: string;
  game_id: string; // which game they played
};
