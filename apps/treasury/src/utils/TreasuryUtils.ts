import { Keypair, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import dotenv from "dotenv";

dotenv.config();

// Check if the HOUSE_WALLET_ADDRESS and HOUSE_SECRET_KEY environment variables are set (NOT SURE IF THIS IS THE BEST WAY TO DO THIS)
if (!process.env.HOUSE_WALLET_ADDRESS || !process.env.HOUSE_SECRET_KEY) {
  throw new Error("Missing HOUSE_WALLET_ADDRESS and/or HOUSE_SECRET_KEY environment variables");
}
const fromKeyPair = Keypair.fromSecretKey(bs58.decode(process.env.HOUSE_SECRET_KEY));
const expectedRecipientPubKey = fromKeyPair.publicKey;
const expectedRecipientPrivateKey = fromKeyPair.secretKey;

export const HOUSE_WALLET_ADDRESS = new PublicKey(expectedRecipientPubKey);
export const HOUSE_WALLET_PRIVATE_KEY = Keypair.fromSecretKey(
  Uint8Array.from(expectedRecipientPrivateKey)
);
