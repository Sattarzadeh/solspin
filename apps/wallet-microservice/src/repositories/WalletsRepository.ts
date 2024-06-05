import { IWalletsRepository } from './IWalletsRepository';
import { db } from '../config/db.config';
import { WalletSelect, WalletInsert, WalletUpdate, Wallets } from '../types';
import { ResourceNotFoundError } from '@shared-types/errors/ResourceNotFoundError';
import { Currency } from '@shared-types/shared-types';
import { sql } from 'kysely';

export class WalletsRepository implements IWalletsRepository {
  async create(wallet: WalletInsert): Promise<void> {
    await db.insertInto('wallets').values(wallet).returningAll().execute();
  }

  async findById(walletId: string): Promise<WalletSelect> {
    return await db
      .selectFrom('wallets')
      .where('wallet_id', '=', walletId)
      .selectAll()
      .executeTakeFirstOrThrow(
        () => new ResourceNotFoundError('Wallet not found')
      );
  }

  async findByUserId(userId: string): Promise<WalletSelect[]> {
    return await db
      .selectFrom('wallets')
      .where('user_id', '=', userId)
      .selectAll()
      .execute();
  }

  async findByUserIdAndCurrency(
    userId: string,
    currency: Currency
  ): Promise<WalletSelect | null> {
    return await db
      .selectFrom('wallets')
      .where('user_id', '=', userId)
      .where('currency', '=', currency)
      .selectAll()
      .executeTakeFirstOrThrow(
        () => new ResourceNotFoundError('Wallet not found')
      );
  }

  async updateWallet(
    userId: string,
    currency: Currency,
    depositAmount: number
  ): Promise<void> {
    await db
      .updateTable('wallets')
      .set({
        balance: sql`balance + ${depositAmount}`,
      })
      .where('user_id', '=', userId)
      .where('currency', '=', currency)
      .execute();
  }

  async delete(userId: string, currency: Currency): Promise<void> {
    await db
      .deleteFrom('wallets')
      .where('user_id', '=', userId)
      .where('currency', '=', currency)
      .execute();
  }
}
