import { Button } from '@mui/material';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import bs58 from 'bs58';
import type { FC } from 'react';
import React, { useCallback } from 'react';
import { useNotify } from './Notify';

export const SignTransaction: FC = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const notify = useNotify();

  const onClick = useCallback(async () => {
    try {
      if (!publicKey) throw new Error('Wallet not connected!');
      if (!signTransaction)
        throw new Error('Wallet does not support transaction signing!');

      const { blockhash } = await connection.getLatestBlockhash();

      const transactionAmount = 0.001;
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: PublicKey.unique(),
        lamports: transactionAmount * 1e9, // Convert transferAmount to lamports
      });
      let transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: publicKey,
      }).add(transferInstruction);
      transaction = await signTransaction(transaction);

      if (!transaction.signature) throw new Error('Transaction not signed!');
      const signature = bs58.encode(transaction.signature);
      notify('info', `Transaction signed: ${signature}`);
      if (!transaction.verifySignatures())
        throw new Error(`Transaction signature invalid! ${signature}`);
      notify('success', `Transaction signature valid! ${signature}`);
    } catch (error: any) {
      notify('error', `Transaction signing failed! ${error?.message}`);
    }
  }, [publicKey, signTransaction, connection, notify]);

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={onClick}
      disabled={!publicKey || !signTransaction}
    >
      Sign Transaction
    </Button>
  );
};