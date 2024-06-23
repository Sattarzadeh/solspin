import { ApiHandler } from "sst/node/api";
import { CreateUserRequestSchema, User, UserSchema } from "@solspin/user-management-types";
import logger from "@solspin/logger";
import { createUser } from "../repository/userRepository";
import { randomUUID } from "crypto";
import { ZodError } from "zod";

const validatePayload = (payload: any) => {
  try {
    return CreateUserRequestSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error("Validation error in create user payload", { error: error.errors });
      throw new Error(JSON.stringify({ message: "Validation Error", errors: error.errors }));
    }
    throw error;
  }
};

const validateUser = (user: User) => {
  try {
    UserSchema.parse(user);
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error("Validation error in user object", { error: error.errors });
      throw new Error(JSON.stringify({ message: "Validation Error", errors: error.errors }));
    }
    throw error;
  }
};

export const handler = ApiHandler(async (event) => {
  try {
    const payload = JSON.parse(event.body || "{}");

    const validatedPayload = validatePayload(payload);

    logger.info(`Creating user with wallet address: ${validatedPayload.walletAddress}`);

    const now = new Date().toISOString();
    const user: User = {
      userId: randomUUID(),
      username: validatedPayload.walletAddress, // Use walletAddress as username if no username is provided
      walletAddress: validatedPayload.walletAddress,
      createdAt: now,
      updatedAt: now,
      level: 0, // Default level to 0
      discord: "", // Default discord to empty string
    };

    validateUser(user);

    await createUser(user);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "User created successfully" }),
    };
  } catch (error) {
    logger.error("Error creating user:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return {
      statusCode: 500,
      body: JSON.stringify({ message: errorMessage }),
    };
  }
});
