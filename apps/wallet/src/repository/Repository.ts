import {
  DuplicateResourceError,
  InvalidResourceError,
  ResourceNotFoundError,
} from "@solspin/errors";
import {
  Transaction,
  TransactionPurpose,
  Wallet,
} from "../../../../@solspin/types/src/service/wallet/schemas";
import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import dynamoDB from "../db/DbConnection";
import { ConditionalCheckFailedException, ReturnValue } from "@aws-sdk/client-dynamodb";

const walletsTableName = process.env.AWS_WALLETS_TABLE_NAME;
const transactionTableName = process.env.AWS_TRANSACTION_TABLE_NAME;

export const depositToDb = async (
  wallet: Wallet,
  depositAmount: number,
  signature: string | null,
  isDeposit = true
): Promise<void> => {
  // Check if the signature is valid for a deposit
  if (isDeposit && !signature) {
    throw new InvalidResourceError("Invalid signature");
  }

  // Update the balance
  wallet.balance += depositAmount;

  // Save the updated user item back to DynamoDB
  const params = {
    TableName: walletsTableName,
    Key: { userId: wallet.userId },
    UpdateExpression: "set balance = :balance",
    ExpressionAttributeValues: {
      ":balance": wallet.balance,
    },
    ReturnValues: ReturnValue.ALL_NEW,
  };

  try {
    // Update the user's wallet
    await dynamoDB.send(new UpdateCommand(params));

    // Record the transaction if it is a deposit
    if (isDeposit) {
      recordTransaction(signature, wallet.userId, depositAmount, true);
    }
  } catch (error) {
    // Log and throw an error
    console.error("Error updating account:", error);
    throw new Error("Error updating account");
  }
};

export const withdrawFromDb = async (
  wallet: Wallet,
  amount: number,
  signature: string
): Promise<void> => {
  try {
    // Check if the user has sufficient balance
    if (wallet.balance < amount) {
      throw new InvalidResourceError("Insufficient balance");
    }

    // Deduct the amount from the wallet
    wallet.balance -= amount;

    // Update the user's wallet
    await updateUser(wallet);

    // Record the transaction
    await recordTransaction(signature, wallet.userId, amount, false);
  } catch (error) {
    // Log and throw an error
    console.log("Error withdrawing from wallet:", error);
    throw error;
  } finally {
    // Unlock the wallet
    await unlockWallet(wallet.userId);
  }
};

export const getBalance = async (userId: string): Promise<number> => {
  // Fetch the wallet
  const wallet = await getWallet(userId);

  // Return the balance
  return wallet.balance;
};

export const getWagerRequirement = async (userId: string): Promise<number> => {
  // Fetch the wallet
  const wallet = await getWallet(userId);

  // Return the wager requirement
  return wallet.wagerRequirement;
};

export const updateWagerRequirement = async (userId: string, amount: number): Promise<void> => {
  // Fetch the wallet
  const wallet = await getWallet(userId);
  // Update the wager requirement
  wallet.wagerRequirement += amount;
};

export const addWallet = async (userId: string, address: string | null = null): Promise<Wallet> => {
  // Check if the wallet already exists
  try {
    await getWallet(userId);
    throw new DuplicateResourceError("Wallet already exists");
  } catch (error: unknown) {
    if (!(error instanceof ResourceNotFoundError)) {
      // Error is not a ResourceNotFoundError
      console.log(error);
      throw error;
    }
  }
  // Create a new user with an empty wallet
  const wallet: Wallet = {
    userId: userId,
    balance: 0,
    wagerRequirement: 0,
    address: address ? address : "",
    lockedAt: "0",
  };

  // add the user to the database
  const params = {
    TableName: walletsTableName,
    Item: wallet,
  };

  // Save the user to the database
  await dynamoDB.send(new PutCommand(params));
  return wallet;
};

export const getWallet = async (userId: string): Promise<Wallet> => {
  // Fetch the user from the database
  const params = {
    TableName: walletsTableName,
    Key: { userId: userId },
  };

  // Fetch the user from the database
  const data = await dynamoDB.send(new GetCommand(params));

  // If the user is not found, throw an error
  if (!data.Item) {
    throw new ResourceNotFoundError("User not found");
  }

  // Return the user
  return data.Item as Wallet;
};

export const updateUser = async (wallet: Wallet): Promise<void> => {
  // Maybe look at using updateItem instead of putItem

  const params = {
    TableName: walletsTableName,
    Item: wallet,
  };
  await dynamoDB.send(new PutCommand(params));
};

export const recordTransaction = async (
  signature: string,
  userId: string,
  amount: number,
  isDeposit: boolean
) => {
  const transaction: Transaction = {
    transactionId: signature,
    userId: userId,
    amount: amount,
    type: isDeposit ? TransactionPurpose.Deposit : TransactionPurpose.Withdraw,
    timestamp: new Date().toISOString(),
  };

  const params = {
    TableName: transactionTableName,
    Item: transaction,
  };
  // Save the transaction to the database
  await dynamoDB.send(new PutCommand(params));
};

export const lockWallet = async (userId: string): Promise<Wallet> => {
  const lockFor = 30000; // Lock duration in milliseconds (2 secs)
  const now = Date.now();

  try {
    /*

      Attempt to lock the wallet by setting lockedAt to the current time.
      The wallet will be locked for the specified duration.
      If the wallet is already locked, the lock will only be acquired if the lock has expired.

      */
    const result = await dynamoDB.send(
      new UpdateCommand({
        TableName: walletsTableName,
        Key: { userId: userId },
        UpdateExpression: `SET lockedAt = :now`,
        ConditionExpression: `lockedAt <= :lockExpiredAt`,
        ExpressionAttributeValues: {
          ":now": now.toString(),
          ":lockExpiredAt": (now - lockFor).toString(),
        },
        ReturnValues: "ALL_NEW",
      })
    );

    // Lock acquired successfully
    console.log("Lock acquired");

    return result.Attributes as Wallet;
  } catch (error: unknown) {
    // Log and throw an error
    if (error instanceof ConditionalCheckFailedException) {
      console.log("Wallet is already locked");
      throw new DuplicateResourceError("Wallet is already locked");
    } else if (error instanceof ResourceNotFoundError) {
      console.log("Wallet not found");
      throw new ResourceNotFoundError("Wallet not found");
    }
    console.log("Error locking the wallet:", error);
    throw error;
  }
};

export const unlockWallet = async (userId: string): Promise<void> => {
  /**
   * Release the lock on the wallet by setting lockedAt to 0 (unlocked)
   * This will allow other operations to access the wallet
   * without waiting for the lock to expire.
   **/
  try {
    // Attempt to "unlock" the wallet by setting lockedAt to 0 (unlocked)
    await dynamoDB.send(
      new UpdateCommand({
        TableName: process.env.AWS_WALLETS_TABLE_NAME,
        Key: { userId: userId },
        UpdateExpression: `SET lockedAt =:now`,
        ExpressionAttributeValues: {
          ":now": "0",
        },
        ReturnValues: ReturnValue.ALL_NEW,
      })
    );
  } catch (error) {
    // Log and throw an error
    console.error("Error unlocking the wallet:", error);
    throw error;
  }
  // Lock released successfully
  console.log("Any locks were released successfully");
};
