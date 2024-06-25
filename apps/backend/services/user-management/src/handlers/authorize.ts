import jwt from "jsonwebtoken";
import { ApiHandler } from "sst/node/api";
import { Config } from "sst/node/config";
import { getLogger } from "@solspin/logger";

const logger = getLogger("authenticate-user-handler");

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

export const handler = ApiHandler(async (event) => {
  const secret = await getSecret();
  // const payload = {
  //   sub: "adowadoawkdawd", // Use `sub` to store the userId
  // };
  // const token = jwt.sign(payload, secret, { algorithm: "HS256", expiresIn: "24h" });
  // console.log(token);
  const token = event.queryStringParameters?.token;

  if (!token) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Token is missing in query parameters" }),
    };
  }

  try {
    logger.info(`Authenticate user lambda handler invoked with token: ${token}`);

    const decoded = jwt.verify(token, secret);

    if (!decoded || typeof decoded === "string" || !decoded.sub) {
      throw new Error("Unauthorized");
    }

    const userId = decoded.sub;
    logger.info(`User authenticated successfully for userId: ${userId}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ userId }),
    };
  } catch (error) {
    logger.error(`Error in authenticate user lambda: ${(error as Error).message}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to authenticate user",
        error: (error as Error).message,
      }),
    };
  }
});
