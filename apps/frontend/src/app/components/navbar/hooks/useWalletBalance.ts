import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";

export const useWalletBalance = (publicKey: PublicKey | null, connection: Connection) => {
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey) return;
      const balance = await connection.getBalance(publicKey);
      setBalance(balance);
    };

    fetchBalance();
  }, [publicKey, connection]);

  return balance;
};
