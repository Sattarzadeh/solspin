import axios from 'axios';

describe('Betting Microservice E2E Test', () => {
  let userId: string;
  let gameId: string;
  let amountBet: number;
  let outcomeAmount: number;
  let outcome: string;
  let walletCurrency: string;
  const baseUrl = 'http://localhost:3002/bets'; // Replace with your app's base URL
  const testBetId = '41f246af-1e54-4faa-87be-25261392ba07';

  beforeEach(() => {
    // Initialize test data
    userId = '2';
    gameId = 'test';
    amountBet = 100;
    outcomeAmount = 200;
    outcome = 'WIN';
    walletCurrency = 'SOL';
  });

  it('should record a bet', async () => {
    const res = await axios.post(`${baseUrl}/record/${userId}`, {
      gameId,
      amountBet,
      outcomeAmount,
      outcome,
      walletCurrency,
    });
    expect(res.status).toEqual(200);
    expect(res.data).toBe('Bet recorded');
  });

  it('should get bet history', async () => {
    const res = await axios.get(`${baseUrl}/${userId}`);

    expect(res.status).toEqual(200);
    expect(res.data).toBeInstanceOf(Array);
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('should get a specific bet', async () => {
    const res = await axios.get(`${baseUrl}/${userId}?betId=${testBetId}`);
    expect(res.status).toEqual(200);

    expect(res.data.outcomeAmount).toBe(outcomeAmount);
    expect(res.data.amountBet).toBe(amountBet);
    expect(res.data.outcome).toBe(outcome);
    expect(res.data.game_id).toBe(gameId);
    expect(res.data.user_id).toBe(userId);
    expect(res.data.bet_id).toBe(testBetId);
  });

  it('should return 404 if bet is not found', async () => {
    try {
      await axios.get(`${baseUrl}/${userId}?betId=nonExistentBetId`);
    } catch (error) {
      expect(error.response.status).toEqual(404);
      expect(error.response.data.errors[0]).toHaveProperty(
        'message',
        'Bet was not found'
      );
    }
  });

  it('should return 400 if required fields are missing', async () => {
    try {
      await axios.post(`${baseUrl}/record/${userId}`, {
        gameId,
        amountBet,
        outcomeAmount,
        outcome,
      });
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data.errors[0].message).toBe(
        'Missing required fields'
      );
    }
  });

  it('should return 400 if bet amount is invalid', async () => {
    try {
      await axios.post(`${baseUrl}/record/${userId}`, {
        gameId,
        amountBet: -100,
        outcomeAmount,
        outcome,
        walletCurrency,
      });
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data.errors[0].message).toBe('Invalid bet amount');
    }
  });

  it('should return 400 if outcome is invalid', async () => {
    try {
      await axios.post(`${baseUrl}/record/${userId}`, {
        gameId,
        amountBet,
        outcomeAmount,
        outcome: 'DRAW',
        walletCurrency,
      });
    } catch (error) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data.errors[0].message).toBe('Invalid outcome');
    }
  });
});
