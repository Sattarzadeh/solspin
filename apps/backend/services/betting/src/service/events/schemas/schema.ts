import { z } from "zod";
import { GameOutcome } from "@solspin/types";

//TODO - remove this enum
export enum GameType {
  CASES = "CASES",
  CASE_BATTLES = "CASE_BATTLES",
}

export const CreateBetRequestSchema = z.object({
  publisher: z.string(),
  metadata: z.object({
    requestId: z.string(),
  }),
  payload: z.object({
    userId: z.string().uuid(),
    gameType: z.nativeEnum(GameType),
    amountBet: z.number().positive(),
    outcome: z.nativeEnum(GameOutcome),
    outcomeAmount: z.number(),
  }),
});

export type CreateBetEvent = z.infer<typeof CreateBetRequestSchema>;
