import { ApiHandler } from "sst/node/api";
import { validateUserInput } from "@solspin/validator";
import logger from "@solspin/logger";
import { getUser } from "../repository/userRepository";
import { ValidationError } from "@solspin/errors";

export const handler = ApiHandler(async (event) => {
  try {
    const userId = event.queryStringParameters?.userId;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "userId is missing in query parameters" }),
      };
    }

    // Validate userId
    validateUserInput(userId, "uuid");

    logger.info(`Fetching user data for userId: ${userId}`);

    const result = await getUser(userId);

    if (!result) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    logger.error("Error fetching user data:", error as Error);
    if (error instanceof ValidationError) {
      return {
        statusCode: (error as ValidationError).statusCode,
        body: JSON.stringify({
          message: "Parameters were not sent correctly ",
          error: (error as ValidationError).message,
        }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error", error: (error as Error).message }),
    };
  }
});
