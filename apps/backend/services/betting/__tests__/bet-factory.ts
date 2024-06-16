import { faker } from "@faker-js/faker";
import { GameOutcome, Bet } from "@solpin/types";

export class BetFactory {
  /**
   * Creates a mock bet object based on the BaseBetSchema.
   *
   * @param overrides - Partial bet object to override default values.
   * @returns The created mock bet object.
   */
  static createMockBet(overrides: Partial<Bet> = {}) {
    const defaultBet: Bet = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      gameId: faker.string.uuid(),
      amountBet: faker.number.int({ min: 1, max: 100 }),
      outcome: faker.helpers.arrayElement(Object.values(GameOutcome)),
      outcomeAmount: faker.number.int({ min: 1, max: 200 }),
      createdAt: faker.date.recent(),
    };

    return {
      ...defaultBet,
      ...overrides,
    };
  }
}
