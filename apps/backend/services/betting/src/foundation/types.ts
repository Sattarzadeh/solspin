import { GameOutcome } from "@solpin/types";

export interface BetDBObject {
  id: string;
  userId: string;
  gameId: string;
  amountBet: number;
  outcome: GameOutcome;
  outcomeAmount: number;
  createdAt: string;
}
