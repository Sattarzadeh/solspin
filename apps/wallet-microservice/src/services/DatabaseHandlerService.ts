import { InvalidResourceError } from '@shared-errors/InvalidResourceError';
import {
  Currency,
  User,
  Wallet,
  Transaction,
  TransactionPurpose,
} from '@shared-types/shared-types';
import { GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ResourceNotFoundError } from '@shared-errors/ResourceNotFoundError';
import dynamoDB from '../db/DbConnection';

class DatabaseHandlerService {
  private walletsTableName: string;
  private transactionTableName: string;

  constructor() {
    this.walletsTableName = process.env.AWS_WALLETS_TABLE_NAME;
    this.transactionTableName = process.env.AWS_TRANSACTION_TABLE_NAME;
  }

  public depositToDb = async (
    userId: string,
    currency: Currency,
    depositAmount: number,
    signature: string
  ): Promise<void> => {
    // Fetch the user
    const user = await this.getUser(userId);

    // Find the account with the specified currency
    const account = user.wallets.find(
      (wallet: Wallet) => wallet.currency === currency
    );
    if (!account) {
      throw new Error('Account not found');
    }

    // Update the balance
    account.balance += depositAmount;

    // Save the updated user item back to DynamoDB
    const params = {
      TableName: this.walletsTableName,
      Item: user,
    };

    try {
      // Update the user's wallet
      await dynamoDB.send(new PutCommand(params));

      // Record the transaction
      const transaction: Transaction = {
        transaction_id: signature,
        userId: userId,
        amount: depositAmount,
        type: TransactionPurpose.Deposit,
        timestamp: new Date().toISOString(),
        currency: currency,
      };
      this.recordTransaction(transaction);
    } catch (error) {
      // Log and throw an error
      console.error('Error updating account:', error);
      throw new Error('Error updating account');
    }
  };

  public withdrawFromDb = async (
    userId: string,
    currency: Currency,
    amount: number,
    signature: string
  ): Promise<void> => {
    // Fetch the user
    const user = await this.getUser(userId);

    try {
      // Find the wallet with the specified currency
      const wallet = user.wallets.find(
        (wallet: Wallet) => wallet.currency === currency
      );

      // If the wallet is not found, throw an error
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      // Check if the user has sufficient balance
      if (wallet.balance < amount) {
        throw new InvalidResourceError('Insufficient balance', 400);
      }

      // Deduct the amount from the wallet
      wallet.balance -= amount;

      // Update the user's wallet
      await this.updateUser(user);

      // Record the transaction
      const transaction: Transaction = {
        transaction_id: signature,
        userId: userId,
        amount: amount,
        type: TransactionPurpose.Withdraw,
        timestamp: new Date().toISOString(),
        currency: currency,
      };

      this.recordTransaction(transaction);
    } catch (error) {
      // Log and throw an error
      console.log('Error withdrawing from wallet:', error);
      throw error;
    }
  };

  public getBalance = async (
    userId: string,
    currency: Currency
  ): Promise<number> => {
    // Fetch the wallet
    const wallet = await this.getWallet(userId, currency);

    // Return the balance
    return wallet.balance;
  };

  public getWagerRequirement = async (
    userId: string,
    currency: Currency
  ): Promise<number> => {
    // Fetch the wallet
    const wallet = await this.getWallet(userId, currency);

    // Return the wager requirement
    return wallet.wagerRequirement;
  };

  public updateWagerRequirement = async (
    userId: string,
    currency: Currency,
    amount: number
  ): Promise<void> => {
    // Fetch the wallet
    const wallet = await this.getWallet(userId, currency);
    // Update the wager requirement
    wallet.wagerRequirement += amount;
  };

  private addUser = async (userId: string): Promise<User> => {
    // Create a new user with an empty wallet
    const user: User = {
      user_id: userId,
      wallets: [],
    };

    // add the user to the database
    const params = {
      TableName: this.walletsTableName,
      Item: user,
    };

    // Save the user to the database
    await dynamoDB.send(new PutCommand(params));
    return user;
  };

  async getUser(userId: string): Promise<User> {
    // Fetch the user from the database
    const params = {
      TableName: this.walletsTableName,
      Key: { user_id: userId },
    };

    // Fetch the user from the database
    const data = await dynamoDB.send(new GetCommand(params));

    // If the user is not found, throw an error
    if (!data.Item) {
      throw new ResourceNotFoundError('User not found');
    }

    // Return the user
    return data.Item as User;
  }

  async getWallet(userId: string, currency: Currency): Promise<Wallet> {
    // Fetch the user
    const user = await this.getUser(userId);

    // Find the wallet with the specified currency
    const wallet = user.wallets.find(
      (wallet: Wallet) => wallet.currency === currency
    );

    // If the wallet is not found, throw an error
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Return the wallet
    return wallet as Wallet;
  }

  public createWallet = async (
    userId: string,
    currency: Currency,
    walletAddress: string
  ): Promise<void> => {
    let user: User;
    try {
      // Fetch the user
      user = await this.getUser(userId);
    } catch (error: unknown) {
      // If the user is not found, create a new user
      if (error instanceof ResourceNotFoundError) {
        console.log('User not found, creating new user');
        user = await this.addUser(userId);
      } else {
        throw error;
      }
    }

    // Check if the wallet already exists
    const wallet = user.wallets.find(
      (wallet: Wallet) => wallet.currency === currency
    );
    if (wallet) {
      console.log(wallet);
      throw new InvalidResourceError('Wallet already exists', 409);
    }

    // Add the new wallet to the user
    user.wallets.push({
      currency,
      balance: 0,
      wagerRequirement: 0,
      address: walletAddress,
      lockedAt: Date.now().toString(),
    });

    // Save the updated user item back to DynamoDB
    const params = {
      TableName: this.walletsTableName,
      Item: user,
    };

    await dynamoDB.send(new PutCommand(params));
  };

  async updateUser(user: User): Promise<void> {
    // Maybe look at using updateItem instead of putItem
    const params = {
      TableName: this.walletsTableName,
      Item: user,
    };
    await dynamoDB.send(new PutCommand(params));
  }

  async recordTransaction(transaction: Transaction) {
    const params = {
      TableName: this.transactionTableName,
      Item: transaction,
    };
    // Save the transaction to the database
    await dynamoDB.send(new PutCommand(params));
  }

  public async lockWallet(user: User, currency: string): Promise<void> {
    const lockFor = 1000_00; // Lock duration in milliseconds (10 secs)
    const now = Date.now();

    // Find the wallet to lock
    const wallets = user.wallets;
    const walletIndex = wallets.findIndex(
      (wallet: Wallet) => wallet.currency === currency
    );

    // If the wallet is not found, throw an error
    if (walletIndex === -1) {
      throw new ResourceNotFoundError('Wallet not found');
    }

    // Path to the wallet in the DynamoDB item
    const walletPath = `wallets[${walletIndex}]`;

    try {
      // Attempt to lock the wallet by setting lockedAt to the current time. The wallet will be locked for the specified duration. If the wallet is already locked, the lock will only be acquired if the lock has expired.
      await dynamoDB.send(
        new UpdateCommand({
          TableName: this.walletsTableName,
          Key: { user_id: user.user_id },
          UpdateExpression: `SET ${walletPath}.lockedAt = :now`,
          ConditionExpression: `${walletPath}.lockedAt <= :lockExpiredAt`,
          ExpressionAttributeValues: {
            ':now': now.toString(),
            ':lockExpiredAt': (now - lockFor).toString(),
          },
          ReturnValues: 'ALL_NEW',
        })
      );
    } catch (error: unknown) {
      // Log and throw an error
      console.error('Error locking the wallet:', error);
      throw error;
    }
    // Lock acquired successfully
    console.log(
      'Current wallet state just before acquiring attempt:',
      wallets[walletIndex]
    );
    console.log('Lock acquired');
  }

  public unlockWallet = async (user: User, currency: string): Promise<void> => {
    try {
      // Find the wallet to unlock
      const wallets = user.wallets;
      const walletIndex = wallets.findIndex(
        (w: Wallet) => w.currency === currency
      );

      // If the wallet is not found, throw an error
      if (walletIndex === -1) {
        throw new Error('Wallet not found');
      }
      // Attempt to "unlock" the wallet by setting lockedAt to 0 (unlocked)
      await dynamoDB.send(
        new UpdateCommand({
          TableName: process.env.AWS_WALLETS_TABLE_NAME,
          Key: { user_id: user.user_id },
          UpdateExpression: `SET wallets[${walletIndex}].lockedAt =:now`,
          ExpressionAttributeValues: {
            ':now': '0',
          },
          ReturnValues: 'ALL_NEW',
        })
      );
    } catch (error) {
      // Log and throw an error
      console.error('Error unlocking the wallet:', error);
      throw error;
    }
    // Lock released successfully
    console.log('Any locks were released successfully');
  };
}

export default DatabaseHandlerService;
