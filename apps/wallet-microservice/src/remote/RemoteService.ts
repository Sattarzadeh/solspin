import axios, { AxiosInstance } from 'axios';
import {
  Currency,
  DepositTransactionResponse,
} from '@shared-types/shared-types';

class RemoteService {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
    });
  }

  public async broadcastWithdrawalTransaction(
    userId: string,
    amount: number,
    currency: Currency,
    walletAddress: string
  ): Promise<string> {
    try {
      // Prepare the request parameters
      const params = {
        userId: userId,
        amount: amount,
        currency: currency,
        walletAddress: walletAddress,
      };

      // Send the request to the treasury service
      const response = await this.client.post(`/withdraw/${userId}`, params);

      // Return the signature from the response
      return response.data.signature;
    } catch (error) {
      // Handle the error
      this.handleError(error);
      throw error;
    }
  }

  public async broadcastDepositTransaction(
    userId: string,
    walletAddress: string,
    currency: Currency,
    signedTransaction: string
  ): Promise<DepositTransactionResponse> {
    try {
      // Prepare the request parameters
      const params = {
        userId: userId,
        walletAddress: walletAddress,
        currency: currency,
        signedTransaction: signedTransaction,
      };

      // Send the request to the treasury service
      const response = await this.client.post(`/deposit/${userId}`, params);

      if (response && response.status !== 200) {
        throw new Error(response.data);
      }

      // Return the response data
      return response.data;
    } catch (error) {
      // Handle the error
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: unknown): void {
    // Log the error
    if (axios.isAxiosError(error)) {
      console.error('Error response:', error.response);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

export default RemoteService;
