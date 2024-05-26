import { Request, Response, NextFunction } from 'express';
import { Currency } from '@shared-types/shared-types'; // Adjust the import path as needed
import DatabaseHandlerService from '../services/DatabaseHandlerService'; // Adjust the import path as needed
import { errorHandler } from '@shared-errors/ErrorHandler'; // Adjust the import path as needed

const databaseHandlerService = new DatabaseHandlerService();

// Middleware to validate user and wallet (this is temp and not a final product)
export const validateUserAndWallet = (requireTransaction: boolean) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId: string = req.params.userId;
      const walletAddress: string = req.body.walletAddress;
      const currency: Currency = req.body.currency;

      const user = await databaseHandlerService.getUser(userId);
      if (!user) {
        res.status(404).send('User does not exist');
        return;
      }

      const wallet = await databaseHandlerService.getWallet(userId, currency);
      console.log(wallet, walletAddress);
      if (!wallet || wallet.address !== walletAddress) {
        res.status(404).send('Invalid wallet address');
        return;
      }

      if (requireTransaction) {
        const base64Transaction: string = req.body.signedTransaction;
        if (!base64Transaction) {
          res.status(400).send('Missing signed transaction');
          return;
        }
      }

      // If everything is fine, proceed to the next middleware or controller
      next();
    } catch (error: unknown) {
      if (error instanceof Error) {
        errorHandler(error, res);
      } else {
        res.status(500).send('Internal server error');
      }
    }
  };
};
