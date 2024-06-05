import { IWalletsRepository } from './IWalletsRepository';
import { db } from '../config/db.config';
import {
  WalletSelect,
  WalletInsert,
  BalanceAndWagerRequirement,
  Wallets,
} from '../types';
import { ResourceNotFoundError } from '@shared-types/errors/ResourceNotFoundError';
import { Currency } from '@shared-types/shared-types';
import { sql } from 'kysely';

export class WalletsRepository implements IWalletsRepository {
  async create(wallet: WalletInsert): Promise<void> {
    await db.insertInto('wallets').values(wallet).execute();
  }

  async findById(walletId: string): Promise<Wallets> {
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

  async updateBalance(
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

  async getBalance(userId: string, currency: Currency): Promise<number> {
    return await db
      .selectFrom('wallets')
      .select('balance')
      .where('user_id', '=', userId)
      .where('currency', '=', currency)
      .executeTakeFirstOrThrow(
        () => new ResourceNotFoundError('Wallet not found')
      )
      .then((obj) => obj.balance);
  }

  async getBalanceAndWagerRequirement(
    userId: string,
    currency: Currency
  ): Promise<BalanceAndWagerRequirement> {
    return await db
      .selectFrom('wallets')
      .select(['balance', 'wager_requirement'])
      .where('user_id', '=', userId)
      .where('currency', '=', currency)
      .executeTakeFirstOrThrow(
        () => new ResourceNotFoundError('Wallet not found')
      )
      .then((obj) => ({
        balance: obj.balance,
        wagerRequirement: obj.wager_requirement,
      }));
  }
}
