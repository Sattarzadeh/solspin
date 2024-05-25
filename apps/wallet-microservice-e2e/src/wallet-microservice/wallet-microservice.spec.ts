import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import { Currency } from '@shared-types/shared-types';
import bs58 from 'bs58';
import { randomUUID } from 'crypto';
import axios, { AxiosError } from 'axios';
import { setTimeout } from 'timers/promises';

if (!process.env.HOUSE_WALLET_ADDRESS || !process.env.HOUSE_SECRET_KEY) {
  throw new Error('Missing HOUSE_WALLET_ADDRESS or HOUSE_SECRET_KEY');
}
const WALLET_ADDRESS = process.env.HOUSE_WALLET_ADDRESS;
const HOUSE_WALLET_PRIVATE_KEY = process.env.HOUSE_SECRET_KEY;
const privatKeyEncoded =
  '5BVZEygtkKCCwrHV6Cf4J1XiRBevy4EiaVym5Ujix3D8oTrMxtfVx9GXW69xcAd4dTH6u6oddH9HY3GDm3Hy1yhH';

const userKeyPair = Keypair.fromSecretKey(bs58.decode(privatKeyEncoded));

jest.setTimeout(75000);

describe('Deposit tests', function () {
  let connection: Connection;
  const toPublicKey = new PublicKey(WALLET_ADDRESS);
  let blockhash: string;
  let lastValidBlockHeight: number;
  let previousBalance: number;

  beforeEach(async () => {
    const latestBlock = await connection.getLatestBlockhash();
    blockhash = latestBlock.blockhash;
    lastValidBlockHeight = latestBlock.lastValidBlockHeight;

    const airdropSignature = await connection.requestAirdrop(
      userKeyPair.publicKey,
      10 * LAMPORTS_PER_SOL
    );

    // Confirm the transaction
    await connection.confirmTransaction(
      {
        signature: airdropSignature,
        lastValidBlockHeight: lastValidBlockHeight,
        blockhash: blockhash,
      },
      'finalized'
    );
    previousBalance = await connection.getBalance(toPublicKey);
  });

  beforeAll(async () => {
    connection = new Connection('http://localhost:8899', 'finalized');
  });

  it('SHOULD send 1 SOL to the house wallet address', async () => {
    const transactionAmount = 1;
    const transaction = await buildTransaction(
      blockhash,
      lastValidBlockHeight,
      userKeyPair,
      toPublicKey,
      transactionAmount
    );

    const response = await axios.post(
      'http://localhost:3000/wallets/deposit/1',
      {
        walletAddress: userKeyPair.publicKey,
        signedTransaction: transaction.serialize(),
        currency: Currency.SOL,
      }
    );
    expect(response.status).toBe(200);
    expect(await connection.getBalance(toPublicKey)).toBe(
      transactionAmount * LAMPORTS_PER_SOL + previousBalance
    );
  });

  it('SHOULD fail WHEN sender has insufficient balance', async () => {
    const transactionAmount = 11;
    const transaction = await buildTransaction(
      blockhash,
      lastValidBlockHeight,
      userKeyPair,
      toPublicKey,
      transactionAmount
    );

    try {
      await axios.post('http://localhost:3000/wallets/deposit/1', {
        walletAddress: userKeyPair.publicKey,
        signedTransaction: transaction.serialize(),
        currency: Currency.SOL,
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log('Error response:', error);
        expect(error.response.status).toBe(404);
      } else {
        fail('Unexpected error');
      }
    }
  });

  it('SHOULD credit user account WHEN deposit is successful', async () => {
    const transactionAmount = 1;
    const transaction = await buildTransaction(
      blockhash,
      lastValidBlockHeight,
      userKeyPair,
      toPublicKey,
      transactionAmount
    );

    const response = await axios.post(
      'http://localhost:3000/wallets/deposit/1',
      {
        walletAddress: userKeyPair.publicKey,
        signedTransaction: transaction.serialize(),
        currency: Currency.SOL,
      }
    );

    expect(response.status).toBe(200);
    expect(await connection.getBalance(toPublicKey)).toBe(
      transactionAmount * LAMPORTS_PER_SOL + previousBalance
    );
  });
});

describe('Withdraw tests', function () {
  // Connect to the Devnet cluster
  const connection = new Connection('http://localhost:8899', 'finalized');
  const houseKeyPair = Keypair.fromSecretKey(
    bs58.decode(HOUSE_WALLET_PRIVATE_KEY)
  );
  let previousBalanceHouse: number;
  let previousBalanceUser: number;
  let blockhash: string;
  let blockHeight: number;

  beforeAll(async () => {
    const airdropSignature = await connection.requestAirdrop(
      userKeyPair.publicKey,
      10 * LAMPORTS_PER_SOL
    );

    // Confirm the transaction
    const latestBlock = await connection.getLatestBlockhash();
    blockhash = latestBlock.blockhash;
    blockHeight = latestBlock.lastValidBlockHeight;

    // Confirm the transaction
    await connection.confirmTransaction(
      {
        signature: airdropSignature,
        lastValidBlockHeight: blockHeight,
        blockhash: blockhash,
      },
      'finalized'
    );
    previousBalanceHouse = await connection.getBalance(houseKeyPair.publicKey);
    previousBalanceUser = await connection.getBalance(userKeyPair.publicKey);
  });

  it('SHOULD send 1 SOL to user and deduct from their balance in db WHEN withdrawal is successful', async () => {
    const response = await axios.post(
      'http://localhost:3000/wallets/withdraw/1',
      {
        walletAddress: userKeyPair.publicKey,
        currency: Currency.SOL,
        amount: 1,
      }
    );

    expect(response.status).toBe(200);
    expect(await connection.getBalance(houseKeyPair.publicKey)).toBe(
      previousBalanceHouse - 1 * LAMPORTS_PER_SOL
    );
    expect(await connection.getBalance(userKeyPair.publicKey)).toBe(
      previousBalanceUser + LAMPORTS_PER_SOL - 5000 // Assume 5000 is the transaction fee
    );
  });

  it('SHOULD fail WHEN user has insufficient balance', async () => {
    try {
      await axios.post('http://localhost:3000/wallets/withdraw/3', {
        walletAddress: userKeyPair.publicKey,
        currency: Currency.SOL,
        amount: 1,
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        expect(error.response.status).toBe(404);
      } else {
        fail('Unexpected error');
      }
    }
  });

  it('SHOULD fail WHEN withdrawal amount is less than 0.1 SOL', async () => {
    try {
      await axios.post('http://localhost:3000/wallets/withdraw/1', {
        walletAddress: userKeyPair.publicKey,
        currency: Currency.SOL,
        amount: 0.099,
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        expect(error.response.status).toBe(400);
      } else {
        fail('Unexpected error');
      }
    }
  });

  it('SHOULD fail WHEN withdrawal amount is greater than house balance', async () => {
    try {
      await axios.post('http://localhost:3000/wallets/withdraw/1', {
        walletAddress: userKeyPair.publicKey,
        currency: Currency.SOL,
        amount: previousBalanceHouse + LAMPORTS_PER_SOL * 1,
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        expect(error.response.status).toBe(402);
      } else {
        fail('Unexpected error');
      }
    }
  });

  it('SHOULD only allow one withdrawal WHEN user initiates multiple withdrawals at once', async () => {
    let successCount = 0;
    let failureCount = 0;

    try {
      await Promise.all([
        axios
          .post('http://localhost:3000/wallets/withdraw/1', {
            walletAddress: userKeyPair.publicKey,
            currency: Currency.SOL,
            amount: 1,
          })
          .then(() => successCount++)
          .catch((error: unknown) => {
            if (error instanceof AxiosError) {
              console.error(
                'Error in first request:',
                error.response ? error.response.data : error.message
              );
              failureCount++;
            } else {
              fail('Unexpected error');
            }
          }),
        axios
          .post('http://localhost:3000/wallets/withdraw/1', {
            walletAddress: userKeyPair.publicKey,
            currency: Currency.SOL,
            amount: 2,
          })
          .then(() => successCount++)
          .catch((error: unknown) => {
            if (error instanceof AxiosError) {
              console.error(
                'Error in second request:',
                error.response ? error.response.data : error.message
              );
              failureCount++;
            } else {
              fail('Unexpected error');
            }
          }),
      ]);

      // Assert that one request succeeded and one request failed
      expect(successCount).toBe(1);
      expect(failureCount).toBe(1);
    } catch (error: unknown) {
      console.error('Unexpected error:', error);
      throw error;
    }
  });
});

describe('Create wallet endpoint tests', function () {
  it('SHOULD succeed WHEN user exists AND wallet does not exist', async () => {
    const userId: string = randomUUID();
    const response = await axios.post(
      `http://localhost:3000/wallets/create/${userId}`,
      {
        currency: Currency.ETH,
        walletAddress: '0x1234567890123456789012345678901234567890',
      }
    );
    expect(response.status).toBe(200);
  });

  it('SHOULD succeed WHEN user does not exist', async () => {
    const userId = randomUUID();
    const response = await axios.post(
      `http://localhost:3000/wallets/create/${userId}`,
      {
        currency: Currency.ETH,
        walletAddress: '0x1234567890123456789012345678901234567890',
      }
    );
    expect(response.status).toBe(200);
  });
  it('SHOULD fail WHEN wallet already exists', async () => {
    const userId = randomUUID();
    try {
      await axios.post(`http://localhost:3000/wallets/create/${userId}`, {
        currency: Currency.SOL,
        walletAddress: '4Z8e5K6i6MdiXxsw3czfs6hhnjPXtteFjgZMefKczq51',
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        expect(error.response.status).toBe(409);
      } else {
        fail('Unexpected error');
      }
    }
  });
});

const buildTransaction = async (
  blockhash: string,
  lastValidBlockHeight: number,
  fromKeyPair: Keypair,
  toPublicKey: PublicKey,
  transactionAmount: number
): Promise<Transaction> => {
  const transaction = new Transaction({
    blockhash: blockhash,
    feePayer: fromKeyPair.publicKey,
    lastValidBlockHeight: lastValidBlockHeight,
  }).add(
    SystemProgram.transfer({
      fromPubkey: fromKeyPair.publicKey,
      toPubkey: toPublicKey,
      lamports: transactionAmount * LAMPORTS_PER_SOL,
    })
  );

  transaction.sign(fromKeyPair);
  return transaction;
};
