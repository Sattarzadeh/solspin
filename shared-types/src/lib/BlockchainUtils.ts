import { InvalidInputError } from '@shared-errors/InvalidInputError';
import { Currency } from './shared-types';

export function parseCurrency(currency: string): Currency | null {
  switch (currency.toUpperCase()) {
    case Currency.SOL:
      return Currency.SOL;
    case Currency.BTC:
      return Currency.BTC;
    case Currency.ETH:
      return Currency.ETH;
    default:
      throw new InvalidInputError('Invalid currency');
  }
}
