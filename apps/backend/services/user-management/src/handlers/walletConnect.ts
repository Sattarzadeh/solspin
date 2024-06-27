import { ApiHandler } from "sst/node/api";
import { createUser, getUserByWalletAddress } from "../data-access/userRepository";
import { UserSchema } from "@solspin/user-management-types";
import jwt from "jsonwebtoken";
import { Config } from "sst/node/config";
import { randomUUID } from "crypto";
import { getLogger } from "@solspin/logger";
import { ZodError } from "zod";

const logger = getLogger("wallet-auth-handler");

let cachedSecret: string | undefined;

async function getSecret(): Promise<string> {
  if (cachedSecret) {
    return cachedSecret;
  }

  // Directly use the secret from Config
  const secret = Config.TEST_SECRET;

  if (!secret) {
    logger.error("JWT_SECRET_KEY is not set in the environment variables.");
    throw new Error("JWT_SECRET_KEY is not set.");
  }

  cachedSecret = secret;
  return cachedSecret as string;
}

const validateUser = (user: any) => {
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
    const { walletAddress } = payload;

    if (!walletAddress) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "walletAddress is required" }),
      };
    }

    let user = await getUserByWalletAddress(walletAddress);

    if (user) {
      logger.info(`User already exists with wallet address: ${walletAddress}`);
    } else {
      logger.info(`Creating new user with wallet address: ${walletAddress}`);
      const now = new Date().toISOString();
      user = {
        userId: randomUUID(),
        username: walletAddress, // Use walletAddress as username if no username is provided
        walletAddress: walletAddress,
        createdAt: now,
        updatedAt: now,
        level: 0, // Default level to 0
        discord: "", // Default discord to empty string
      };

      validateUser(user);
      await createUser(user);
    }

    const userId = user.userId;
    const jwtpayload = {
      sub: userId,
    };
    const secret = await getSecret();
    const token = jwt.sign(jwtpayload, secret, { algorithm: "HS256", expiresIn: "24h" });

    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (error) {
    logger.error("Error processing wallet authentication:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return {
      statusCode: 500,
      body: JSON.stringify({ message: errorMessage }),
    };
  }
});
