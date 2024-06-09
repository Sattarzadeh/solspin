import axios from 'axios';

const baseURL = 'https://price.jup.ag/v4';
const priceSubURL = '/price?ids=';
const client = axios.create({ baseURL });

export const getCurrentPrice = async (): Promise<number> => {
  try {
    const response = await client.get(priceSubURL + 'SOL');
    return response.data.price;
  } catch (error) {
    throw error;
  }
};
