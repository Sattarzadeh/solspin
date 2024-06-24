import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { TransactionsDBObject, TransactionType } from "../foundation/types";
import { TRANSACTIONS_TABLE_ARN } from "../foundation/runtime";
import { getLogger } from "@solspin/logger";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const logger = getLogger("record-transaction");

export const recordTransaction = async (
  id: string,
  userId: string,
  amount: number,
  walletAddress: string,
  txnId: string,
  type: TransactionType
): Promise<void> => {
  const createdAt = new Date().toISOString();

  const transaction: TransactionsDBObject = {
    id: id,
    userId: userId,
    amount: amount,
    createdAt: createdAt,
    walletAddress: walletAddress,
    txnId: txnId,
    type: type,
  };

  await docClient.send(
    new PutCommand({
      TableName: TRANSACTIONS_TABLE_ARN,
      Item: transaction,
    })
  );

  logger.info("Transaction recorded successfully", { transaction });
};
