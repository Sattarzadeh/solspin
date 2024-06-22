import axios from 'axios';

const baseURL = 'https://price.jup.ag/v4';
const client = axios.create({ baseURL });
const priceSubURL = '/price?ids=';

export const getCurrentPrice = async (): Promise<number> => {
  try {
    const response = await client.get(priceSubURL + 'SOL');
    return response.data.data.SOL.price;
  } catch (error) {
    console.log('Error fetching price:', error);
    throw error;
  }
};
