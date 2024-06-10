import axios from 'axios';
import { Currency } from '@shared-types/shared-types'; // Adjust the import path as needed
import { createTransactionForBet } from '@betting-microservice/remote/WalletRemote';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('createTransactionForBet', () => {
  let client: jest.Mocked<typeof axios>;

  beforeEach(() => {
    client = {
      put: jest.fn(),
    } as unknown as jest.Mocked<typeof axios>;
    mockedAxios.create.mockReturnValue(client);
  });

  it('should create a transaction for a bet successfully', async () => {
    const userId = 'user123';
    const amount = 100;
    const response = { success: true };

    client.put.mockResolvedValue({ data: response });

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await createTransactionForBet(userId, amount);

    expect(client.put).toHaveBeenCalledWith(`/balance/update/${userId}`, {
      amount,
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({ data: response })
    );

    consoleSpy.mockRestore();
  });

  it('should handle error when creating a transaction for a bet', async () => {
    const userId = 'user123';
    const amount = 100;
    const errorResponse = { message: 'Error' };

    client.put.mockRejectedValue({
      response: { data: errorResponse },
    });

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    try {
      await createTransactionForBet(userId, amount);
    } catch (error: any) {
      expect(error.response.data).toEqual(errorResponse);
    }

    expect(client.put).toHaveBeenCalledWith(`/balance/update/${userId}`, {
      amount,
    });
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ data: errorResponse })
    );

    consoleSpy.mockRestore();
  });
});
