import { DynamoDBClient, ReturnValue } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { WALLETS_TABLE_ARN } from "../foundation/runtime";
import { getLogger } from "@solspin/logger";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const logger = getLogger("unlockWallet");

export const unlockWallet = async (userId: string): Promise<void> => {
  /**
   * Release the lock on the wallet by setting lockedAt to 0 (unlocked)
   * This will allow other operations to access the wallet
   * without waiting for the lock to expire.
   **/
  try {
    // Attempt to "unlock" the wallet by setting lockedAt to 0 (unlocked)
    await docClient.send(
      new UpdateCommand({
        TableName: WALLETS_TABLE_ARN,
        Key: { userId: userId },
        UpdateExpression: `SET lockedAt =:now`,
        ExpressionAttributeValues: {
          ":now": "0",
        },
        ReturnValues: ReturnValue.ALL_NEW,
      })
    );
    logger.info("Lock released", { userId });
  } catch (error) {
    // Log and throw an error
    logger.error("Error unlocking the wallet:", { userId, error });
    throw error;
  }
};
