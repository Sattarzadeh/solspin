import { Request, Response } from "express";
import { errorHandler, InvalidInputError } from "@solspin/errors";
import {
  createWallet,
  getBalance,
  handleDeposit,
  handleWithdrawal,
  updateUserBalance,
} from "../services/TransactionService";

class WalletController {
  public deposit = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const { walletAddress, signedTransaction: base64Transaction } = req.body;

      console.log(`Deposit for user: ${userId} with walletAddress: ${walletAddress}`);

      await handleDeposit(userId, walletAddress, base64Transaction);

      res.status(200).send("Deposit successful");
    } catch (error) {
      errorHandler(error, res);
    }
  };

  public withdraw = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const { walletAddress, amount } = req.body;

      await handleWithdrawal(userId, walletAddress, amount);

      res.status(200).send("Withdrawal successful");
    } catch (error) {
      errorHandler(error, res);
    }
  };

  public balance = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;

      const balance = await getBalance(userId);
      res.status(200).json({ balance }).send();
    } catch (error) {
      errorHandler(error, res);
    }
  };

  public createWallet = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const { walletAddress } = req.body;

      if (!userId || !walletAddress) {
        res.status(400).send("Missing required fields");
        return;
      }

      await createWallet(userId, walletAddress);
      res.status(200).send("Wallet created successfully");
    } catch (error) {
      errorHandler(error, res);
    }
  };

  public updateBalance = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const amount = req.body.amount;

      console.log("Updating balance for user:", userId, amount);
      if (!userId || !amount) {
        throw new InvalidInputError("Missing required fields");
      }

      await updateUserBalance(userId, amount);

      res.status(200).send("Balance updated successfully");
    } catch (error) {
      errorHandler(error, res);
    }
  };
}

export { WalletController };
