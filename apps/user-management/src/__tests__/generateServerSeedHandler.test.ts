import { APIGatewayProxyEvent } from 'aws-lambda';
import createMockContext from 'aws-lambda-mock-context';
import { generateServerSeedHandler } from '../handlers/generateServerSeedHandler';
import redis from '../redis/redisConnection';
import crypto from 'crypto';

// Mock dependencies
jest.mock('../redis/redisConnection');
jest.mock('crypto', () => ({
  randomBytes: jest.fn(() => Buffer.from('serverseed1234567890abcdef1234567890')),
}));

const mockRedisGet = redis.get as jest.Mock;
const mockRedisSet = redis.set as jest.Mock;
const mockRandomBytes = crypto.randomBytes as jest.Mock;

describe('generateServerSeedHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if sessionId is missing', async () => {
    const event = {
      body: '{}',
    } as APIGatewayProxyEvent;

    const context = createMockContext();
    const response = await generateServerSeedHandler(event, context, () => {});

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({ message: 'Missing sessionId' });
  });

  it('should return 401 if session is invalid', async () => {
    const sessionId = 'test-session-id';
    const event = {
      body: JSON.stringify({ sessionId }),
    } as APIGatewayProxyEvent;

    const context = createMockContext();

    mockRedisGet.mockResolvedValue(null);

    const response = await generateServerSeedHandler(event, context, () => {});

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toEqual({ message: 'Invalid session' });
    expect(mockRedisGet).toHaveBeenCalledWith(`session:${sessionId}`);
  });

  it('should generate server seed and update session', async () => {
    const sessionId = 'test-session-id';
    const sessionData = { userId: 'test-user-id', sessionId, createdAt: Date.now() };
    const event = {
      body: JSON.stringify({ sessionId }),
    } as APIGatewayProxyEvent;

    const context = createMockContext();

    mockRedisGet.mockResolvedValue(JSON.stringify(sessionData));
    mockRedisSet.mockResolvedValue('OK');

    const response = await generateServerSeedHandler(event, context, () => {});

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ serverSeed: 'serverseed1234567890abcdef1234567890' });
    expect(mockRandomBytes).toHaveBeenCalledWith(32);
    expect(mockRedisGet).toHaveBeenCalledWith(`session:${sessionId}`);
    expect(mockRedisSet).toHaveBeenCalledWith(
      `session:${sessionId}`,
      JSON.stringify({
        ...sessionData,
        serverSeed: 'serverseed1234567890abcdef1234567890',
      }),
      'EX',
      3600
    );
  });

  it('should handle Redis errors gracefully', async () => {
    const sessionId = 'test-session-id';
    const event = {
      body: JSON.stringify({ sessionId }),
    } as APIGatewayProxyEvent;

    const context = createMockContext();

    mockRedisGet.mockRejectedValue(new Error('Redis error'));

    const response = await generateServerSeedHandler(event, context, () => {});

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toEqual({ message: 'Invalid session' });
    expect(mockRedisGet).toHaveBeenCalledWith(`session:${sessionId}`);
  });
});
