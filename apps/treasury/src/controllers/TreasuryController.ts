import { Request, Response } from "express";
import { TransactionService } from "../services/TransactionService";
import BlockchainService from "../services/BlockchainService";
import { errorHandler } from "@solspin/errors";

export class TreasuryController {
  private transactionService: TransactionService;

  constructor() {
    const blockchainService = new BlockchainService();
    this.transactionService = new TransactionService(blockchainService);
  }

  public withdraw = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Withdraw request received");
      const userId = req.params.userId;
      const { amount, walletAddress } = req.body;

      if (!userId || !amount || !walletAddress) {
        res.status(400).send("Invalid request");
        return;
      }

      console.log(amount);
      const { signature } = await this.transactionService.processWithdrawal(
        userId,
        amount,
        walletAddress
      );

      // Return transaction signature (id) to wallet service
      res.status(200).send({ signature });
    } catch (error) {
      console.log(error);
      errorHandler(error, res);
    }
  };

  public deposit = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId: string = req.params.userId;
      const { walletAddress, signedTransaction: base64Transaction } = req.body;

      console.log(
        `Deposit request received for user: ${userId}, wallet_address: ${walletAddress}, signed_transaction: ${base64Transaction}`
      );

      const response = await this.transactionService.processDeposit(
        userId,
        walletAddress,
        base64Transaction
      );

      // Return response object to wallet service
      res.status(200).send(JSON.stringify(response));
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        errorHandler(error, res);
      }
      throw Error("Internal server error");
    }
  };
}
