import axios from "axios";
import { getLogger } from "@solspin/logger";

const baseURL = "https://price.jup.ag/v4";
const client = axios.create({ baseURL });
const priceSubURL = "/price?ids=";
const logger = getLogger("withdraw-handler");

export const getCurrentPrice = async (): Promise<number> => {
  try {
    const response = await client.get(priceSubURL + "SOL");
    const priceRounded = Number((Math.round(response.data.data.SOL.price * 100) / 100).toFixed(2));
    logger.info("Price fetched:", {
      response: response.data.data.SOL.price,
      priceRounded: priceRounded,
    });
    return priceRounded;
  } catch (error) {
    logger.error("Error fetching price:", { error });
    throw error;
  }
};
