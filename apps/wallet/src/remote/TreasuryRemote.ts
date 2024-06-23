import axios from "axios";
import { DepositTransactionResponse } from "../../../../@solspin/types/src/service/wallet/schemas";

const baseURL = "http://localhost:3001/treasury";
const client = axios.create({ baseURL });

export const broadcastWithdrawalTransaction = async (
  userId: string,
  amount: number,
  walletAddress: string
): Promise<string> => {
  try {
    // Prepare the request parameters
    const params = {
      userId: userId,
      amount: amount,
      walletAddress: walletAddress,
    };

    // Send the request to the treasury service
    const response = await client.post(`/withdraw/${userId}`, params);
    console.log(response);
    // Return the signature from the response
    return response.data.signature;
  } catch (error) {
    // Handle the error
    handleError(error);
    throw error;
  }
};

export const broadcastDepositTransaction = async (
  userId: string,
  walletAddress: string,
  signedTransaction: string
): Promise<DepositTransactionResponse> => {
  try {
    // Prepare the request parameters
    const params = {
      userId: userId,
      walletAddress: walletAddress,
      signedTransaction: signedTransaction,
    };

    // Send the request to the treasury service
    const response = await client.post(`/deposit/${userId}`, params);

    if (response && response.status !== 200) {
      console.log(response.status, response.data);
      throw new Error(response.data);
    }

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle the error
    handleError(error);
    throw error;
  }
};

const handleError = (error: unknown): void => {
  // Log the error
  if (axios.isAxiosError(error)) {
    console.error("Error response:", error.response);
  } else {
    console.error("Unexpected error:", error);
  }
};
