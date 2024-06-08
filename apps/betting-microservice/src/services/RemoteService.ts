import axios, { AxiosInstance } from 'axios';
import { Currency } from '@shared-types/shared-types';

export class RemoteService {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
    });
  }

  public async createTransactionForBet(
    userId: string,
    amount: number,
    currency: Currency
  ) {
    const params = {
      amount: amount,
      currency: currency,
    };

    // Send the request to the wallet service
    const response = await this.client.put(`/balance/update/${userId}`, params);
    console.log(response);
  }
}
