import { ApiHandler } from "sst/node/api";
import { validateUserInput } from "@solspin/validator";
import logger from "@solspin/logger";
import { getUser } from "../repository/userRepository";
import { ValidationError } from "@solspin/errors";
import { GetUserByIdRequestSchema } from "@solspin/user-management-types";
import { ZodError } from "zod";
export const handler = ApiHandler(async (event) => {
  const userId = event.queryStringParameters?.userId;
  logger.info(`Get user lambda called with userId: ${userId}`);

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "userId is required" }),
    };
  }

  try {
    GetUserByIdRequestSchema.parse({ userId });
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error("Validation error in userId", { error });
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Validation Error",
          errors: error.errors,
        }),
      };
    }
    throw error;
  }
  try {
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
