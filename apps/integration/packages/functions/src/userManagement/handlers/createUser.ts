import { ApiHandler } from "sst/node/api";
import { validateUserInput } from "@solspin/validator";
import logger from "@solspin/logger";
import { createUser } from "../repository/userRepository";

export const handler = ApiHandler(async (event) => {
  try {
    const user = JSON.parse(event.body || "{}");

    if (
      !user.userId ||
      !user.discord ||
      !user.createdAt ||
      !user.updatedAt ||
      !user.level ||
      !user.walletId
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required user fields" }),
      };
    }

    // Validate user fields
    validateUserInput(user.userId, "uuid");
    validateUserInput(user.discord, "alphanumeric");
    validateUserInput(user.createdAt, "alphanumeric");
    validateUserInput(user.updatedAt, "alphanumeric");
    validateUserInput(user.level, "int");
    validateUserInput(user.walletId, "alphanumeric");

    logger.info(`Creating user with ID: ${user.userId}`);

    await createUser(user);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "User created successfully" }),
    };
  } catch (error) {
    logger.error("Error creating user:", (error as Error).message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error", error: (error as Error).message }),
    };
  }
});
