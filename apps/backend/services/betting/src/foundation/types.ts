import { GameOutcome } from "@solspin/types";
import { GameType } from "../service/events/schemas/schema";

export interface BetDBObject {
  id: string;
  userId: string;
  gameType: GameType;
  amountBet: number;
  outcome: GameOutcome;
  outcomeAmount: number;
  createdAt: string;
}
