import { GameOutcome } from "@solspin/types";

export interface BetDBObject {
  id: string;
  userId: string;
  gameId: string;
  amountBet: number;
  outcome: GameOutcome;
  outcomeAmount: number;
  timestamp: Date;
}
