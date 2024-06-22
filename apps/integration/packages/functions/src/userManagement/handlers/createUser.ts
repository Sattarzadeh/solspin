import { ApiHandler } from "sst/node/api";
import { validateUserInput } from "@solspin/validator";
import logger from "@solspin/logger";
import { createUser } from "../repository/userRepository";
import { User } from "@solspin/user-management-types";
import { randomUUID } from "crypto";
export const handler = ApiHandler(async (event) => {
  try {
    const payload = JSON.parse(event.body || "{}");

    if (!payload.walletAddress) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required user fields" }),
      };
    }

    // Validate user fields
    validateUserInput(payload.walletAddress, "alphanumeric");

    logger.info(`Creating user with wallet address: ${payload.walletAddress}`);
    // call create wallet here before proceeding

    let user: User = {
      userId: randomUUID(),
      username: payload.walletAddress,
      walletAddress: payload.walletAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      level: 0,
      discord: "",
    };

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
