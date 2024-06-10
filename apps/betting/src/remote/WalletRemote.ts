import axios, { AxiosInstance } from 'axios';

const baseURL = 'http://localhost:3000/wallets';
const client = axios.create({ baseURL });

export const createTransactionForBet = async (
  userId: string,
  amount: number
) => {
  const params = {
    amount: amount,
  };

  // Send the request to the wallet service
  const response = await client.put(`/balance/update/${userId}`, params);
  console.log(response);
};
