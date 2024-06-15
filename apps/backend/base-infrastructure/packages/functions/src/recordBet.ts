import { saveBet } from "@bets/service";
import { ApiHandler } from "sst/node/api";
import { InvalidInputError } from "@solspin/errors";

export const handler = ApiHandler(async (event) => {
  try {
    const userId = event.pathParameters?.userId;
    const { amountBet, outcomeAmount, outcome, gameId } = JSON.parse(event.body || "{}");

    if (!amountBet || !outcomeAmount || !outcome || !gameId || !userId) {
      throw new InvalidInputError("Missing required fields");
    }

    await saveBet(userId, gameId, amountBet, outcomeAmount, outcome);
    return {
      statusCode: 200,
      body: JSON.stringify("Bet recorded"),
    };
  } catch (error) {
    console.log("error", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong" }),
    };
  }
});
