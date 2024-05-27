import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { RemoteService } from '../../services/RemoteService';
import { Currency } from '@shared-types/shared-types'; // Adjust the import path as needed

describe('RemoteService', () => {
  let mock: MockAdapter;
  let service: RemoteService;
  const baseURL = 'http://localhost:3000/wallets'; // Replace with actual baseURL if needed

  beforeEach(() => {
    mock = new MockAdapter(axios);
    service = new RemoteService(baseURL);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should create a transaction for a bet successfully', async () => {
    const userId = 'user123';
    const amount = 100;
    const currency: Currency = Currency.SOL; // Replace with appropriate currency type if needed
    const response = { success: true };

    mock.onPut(`/balance/update/${userId}`, { amount, currency }).reply(200, response);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await service.createTransactionForBet(userId, amount, currency);

    expect(mock.history.put.length).toBe(1);
    expect(mock.history.put[0].url).toBe(`/balance/update/${userId}`);
    expect(mock.history.put[0].data).toBe(JSON.stringify({ amount, currency }));
    expect(consoleSpy).toHaveBeenCalledWith(expect.objectContaining({ data: response }));

    consoleSpy.mockRestore();
  });

  it('should handle error when creating a transaction for a bet', async () => {
    const userId = 'user123';
    const amount = 100;
    const currency: Currency = Currency.SOL; // Replace with appropriate currency type if needed
    const errorResponse = { message: 'Error' };

    mock.onPut(`/balance/update/${userId}`, { amount, currency }).reply(500, errorResponse);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    try {
      await service.createTransactionForBet(userId, amount, currency);
    } catch (error) {
      expect(error.response.data).toEqual(errorResponse);
    }

    expect(mock.history.put.length).toBe(1);
    expect(mock.history.put[0].url).toBe(`/balance/update/${userId}`);
    expect(mock.history.put[0].data).toBe(JSON.stringify({ amount, currency }));
    expect(consoleSpy).not.toHaveBeenCalledWith(expect.objectContaining({ data: errorResponse }));

    consoleSpy.mockRestore();
  });
});
