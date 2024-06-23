import { ApiHandler } from "sst/node/api";
import { validateUserInput } from "@solspin/validator";
import logger from "@solspin/logger";
import { deleteUser } from "../repository/userRepository";

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

    logger.info(`Deleting user data for userId: ${userId}`);

    await deleteUser(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User deleted successfully" }),
    };
  } catch (error) {
    logger.error("Error deleting user data:", (error as Error).message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error", error: (error as Error).message }),
    };
  }
});
