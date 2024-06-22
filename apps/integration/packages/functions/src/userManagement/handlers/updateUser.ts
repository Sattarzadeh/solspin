import { ApiHandler } from "sst/node/api";
import { validateUserInput } from "@solspin/validator";
import logger from "@solspin/logger";
import { updateUser } from "../repository/userRepository";

export const handler = ApiHandler(async (event) => {
  try {
    const { userId, updateFields } = JSON.parse(event.body || "{}");

    if (!userId || !updateFields) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing userId or updateFields" }),
      };
    }

    // Validate userId
    validateUserInput(userId, "uuid");

    // Validate each entry in updateFields
    for (const [key, value] of Object.entries(updateFields)) {
      switch (key) {
        case "discord":
        case "walletId":
          validateUserInput(value, "alphanumeric");
          break;
        case "createdAt":
        case "updatedAt":
          validateUserInput(value, "alphanumeric");
          break;
        case "level":
          validateUserInput(value, "int");
          break;
        default:
          return {
            statusCode: 400,
            body: JSON.stringify({ message: `Invalid field ${key} in updateFields` }),
          };
      }
    }

    logger.info(
      `Updating user data for userId: ${userId} with fields: ${JSON.stringify(updateFields)}`
    );

    const result = await updateUser(userId, updateFields);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    logger.error("Error updating user data:", (error as Error).message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error", error: (error as Error).message }),
    };
  }
});
