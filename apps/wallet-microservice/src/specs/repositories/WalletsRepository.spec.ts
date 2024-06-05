import { sql } from 'kysely';
import { db } from '../../config/db.config';
import { WalletsRepository } from '../../repositories/WalletsRepository';
import { Currency } from '@shared-types/shared-types';
import {
  WalletUpdate,
  WalletState,
  WalletInsert,
} from '@wallet-microservice/types';

describe('WalletsRepository', () => {
  let walletsRepository: WalletsRepository;
  beforeAll(async () => {
    walletsRepository = new WalletsRepository();
    await db.schema
      .createTable('wallets')
      .addColumn('wallet_id', 'varchar', (cb) => cb.primaryKey())
      .addColumn('user_id', 'varchar', (cb) => cb.notNull())
      .addColumn('currency', 'varchar(50)', (cb) => cb.notNull())
      .addColumn('balance', 'numeric', (cb) => cb.notNull())
      .addColumn('wager_requirement', 'numeric', (cb) => cb.notNull())
      .addColumn('address', 'varchar')
      .addColumn('state', 'varchar', (cb) => cb.notNull())
      .addColumn('created_at', 'timestamp', (cb) =>
        cb.notNull().defaultTo(sql`now()`)
      )
      .execute();
  });

  beforeEach(async () => {
    const wallet: WalletInsert = {
      wallet_id: '123',
      user_id: '123',
      currency: Currency.SOL,
      balance: 100,
      wager_requirement: 100,
      address: '123',
      state: 'ACTIVE',
    };

    await walletsRepository.create(wallet);
  });

  afterEach(async () => {
    await sql`truncate table ${sql.table('wallets')}`.execute(db);
  });

  afterAll(async () => {
    await db.schema.dropTable('wallets').execute();
    await db.destroy();
  });

  it('should find a wallet with a given wallet id', async () => {
    const resp = await walletsRepository.findById('123');

    expect(resp).toEqual({
      wallet_id: '123',
      user_id: '123',
      currency: Currency.SOL,
      balance: 100,
      wager_requirement: 100,
      address: '123',
      state: 'ACTIVE',
    });
  });

  it('should find all wallets belonging to user', async () => {
    await walletsRepository.findByUserId('123');
  });

  it('should update balance of wallet', async () => {
    await walletsRepository.updateWallet('123', Currency.SOL, 10);
  });

  it('should create a wallet', async () => {
    const wallet: WalletInsert = {
      wallet_id: '12',
      user_id: '123',
      currency: Currency.SOL,
      balance: 100,
      wager_requirement: 100,
      address: '123',
      state: 'ACTIVE',
    };

    await walletsRepository.create(wallet);
  });

  it('should delete a wallet with a given id', async () => {
    await walletsRepository.delete('123', Currency.SOL);
  });
});
