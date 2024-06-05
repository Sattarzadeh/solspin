import { Currency } from '@shared-types/shared-types';
import { WalletInsert, WalletSelect, WalletUpdate } from '../types';

export interface IWalletsRepository {
  create(wallet: WalletInsert): Promise<void>;
  findById(walletId: string): Promise<WalletSelect>;
  findByUserId(userId: string): Promise<WalletSelect[]>;
  findByUserIdAndCurrency(
    userId: string,
    currency: string
  ): Promise<WalletSelect | null>;
  updateWallet(
    user_id: string,
    currency: Currency,
    amount: number
  ): Promise<void>;
  delete(userId: string, currency: Currency): Promise<void>;
}
