// WalletSignInButton.jsx
'use client';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import dynamic from 'next/dynamic';
import React, { useState, useCallback, useEffect } from 'react';
import { SignTransaction } from './SignTransaction';

export const WalletSignInButton = () => {
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  const [isSigningTransaction, setIsSigningTransaction] = useState(false);
  const WalletMultiButtonDynamic = dynamic(
    async () =>
      (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
  );
    
  useEffect(() => {
    if (connected && publicKey) {
      const publicKeyString = publicKey.toBase58();
      console.log('Wallet connected:', publicKeyString);

      // Send HTTP request when the wallet connects
      const sendWalletConnectedRequest = async () => {
        try {
          const response = await fetch('/api/wallet-connected', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ publicKey: publicKeyString }),
          });
          
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          console.log('Server response:', data);
        } catch (error) {
          console.error('Error sending wallet connected request:', error);
        }
      };

      sendWalletConnectedRequest();
    }
  }, [connected, publicKey]);

  return (
    <WalletMultiButtonDynamic/>
  );
};