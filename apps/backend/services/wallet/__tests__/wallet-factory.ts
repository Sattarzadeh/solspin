import { faker } from "@faker-js/faker";
import { WalletsDBObject } from "../src/foundation/types";

export class WalletFactory {
  /**
   * Creates a mock bet object based on the BaseBetSchema.
   *
   * @param overrides - Partial bet object to override default values.
   * @returns The created mock bet object.
   */
  static createMockWallet(overrides: Partial<WalletsDBObject> = {}) {
    const defaultWallet: WalletsDBObject = {
      userId: faker.string.uuid(),
      balance: faker.number.float({ min: 0, max: 1000 }),
      wagerRequirement: faker.number.float({ min: 0, max: 1000 }),
      walletAddress: faker.string.uuid(),
      createdAt: faker.string.sample(5),
      lockedAt: String(faker.number),
    };

    return {
      ...defaultWallet,
      ...overrides,
    };
  }
}
