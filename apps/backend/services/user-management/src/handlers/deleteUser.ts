import { ApiHandler } from "sst/node/api";
import { DeleteUserRequestSchema } from "@solspin/user-management-types";
import { deleteUser } from "../data-access/userRepository";
import { ZodError } from "zod";
import { getLogger } from "@solspin/logger";

const logger = getLogger("delete-user-handler");
export const handler = ApiHandler(async (event) => {
  try {
    const queryStringParameters = event.queryStringParameters || {};

    // Validate query parameters using DeleteUserRequestSchema
    const parsedParams = DeleteUserRequestSchema.safeParse(queryStringParameters);
    if (!parsedParams.success) {
      logger.error("Validation error in query parameters", { error: parsedParams.error.errors });
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Validation Error",
          errors: parsedParams.error.errors,
        }),
      };
    }

    const { userId } = parsedParams.data;

    logger.info(`Deleting user data for userId: ${userId}`);

    await deleteUser(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User deleted successfully" }),
    };
  } catch (error) {
    logger.error("Error deleting user data:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return {
      statusCode: 500,
      body: JSON.stringify({ message: errorMessage }),
    };
  }
});
