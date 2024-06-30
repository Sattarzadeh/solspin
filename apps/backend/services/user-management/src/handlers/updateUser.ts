import { ApiHandler } from "sst/node/api";
import { UpdateUserRequestSchema } from "@solspin/user-management-types";
import { updateUser } from "../data-access/userRepository";
import { ZodError } from "zod";
import { getLogger } from "@solspin/logger";

const logger = getLogger("update-user-handler");
export const handler = ApiHandler(async (event) => {
  try {
    const payload = JSON.parse(event.body || "{}");
    const userId: string = event.requestContext.authorizer.lambda.userId;
    const parsedPayload = UpdateUserRequestSchema.safeParse(payload);
    if (!parsedPayload.success) {
      logger.error("Validation error in request payload", { error: parsedPayload.error.errors });
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Validation Error",
          errors: parsedPayload.error.errors,
        }),
      };
    }

    const { updateFields } = parsedPayload.data;

    logger.info(
      `Updating user data for userId: ${userId} with fields: ${JSON.stringify(updateFields)}`
    );

    const result = await updateUser(userId, updateFields);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    logger.error("Error updating user data:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return {
      statusCode: 500,
      body: JSON.stringify({ message: errorMessage }),
    };
  }
});
