import { z } from "zod";
import {
  BaseBetSchema,
  BetQuerySchema,
  CreateBetRequestSchema,
  CreateBetResponseSchema,
  GetBetByIdRequestSchema,
  GetBetByIdResponseSchema,
  GetBetsByGameIdRequestSchema,
  GetBetsByGameIdResponseSchema,
  GetBetsByUserIdRequestSchema,
  GetBetsByUserIdResponseSchema,
} from "./schemas";

export enum GameOutcome {
  WIN = "WIN",
  LOSE = "LOSE",
  MOCK = "MOCK",
}

// Infer types from schemas
export type Bet = z.infer<typeof BaseBetSchema>;
export type CreateBetRequest = z.infer<typeof CreateBetRequestSchema>;
export type CreateBetResponse = z.infer<typeof CreateBetResponseSchema>;
export type GetBetByIdRequest = z.infer<typeof GetBetByIdRequestSchema>;
export type GetBetByIdResponse = z.infer<typeof GetBetByIdResponseSchema>;
export type GetBetsByUserIdRequest = z.infer<typeof GetBetsByUserIdRequestSchema>;
export type GetBetsByUserIdResponse = z.infer<typeof GetBetsByUserIdResponseSchema>;
export type GetBetsByGameIdRequest = z.infer<typeof GetBetsByGameIdRequestSchema>;
export type GetBetsByGameIdResponse = z.infer<typeof GetBetsByGameIdResponseSchema>;
export type BetQuery = z.infer<typeof BetQuerySchema>;
