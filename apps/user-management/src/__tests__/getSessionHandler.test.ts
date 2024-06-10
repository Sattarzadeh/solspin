import { APIGatewayProxyEvent } from 'aws-lambda';
import createMockContext from 'aws-lambda-mock-context';
import { getSessionHandler } from '../handlers/getSessionHandler';
import redis from '../redis/redisConnection';

// Mock dependencies
jest.mock('../redis/redisConnection');

const mockRedisGet = redis.get as jest.Mock;

describe('getSessionHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if sessionId is missing', async () => {
    const event = {
      queryStringParameters: {},
    } as APIGatewayProxyEvent;

    const context = createMockContext();
    const response = await getSessionHandler(event, context, () => {});

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toEqual({ message: 'Missing sessionId' });
  });

  it('should return 401 if session is invalid', async () => {
    const sessionId = 'test-session-id';
    const event = {
      queryStringParameters: { sessionId },
    } as APIGatewayProxyEvent;

    const context = createMockContext();

    mockRedisGet.mockResolvedValue(null);

    const response = await getSessionHandler(event, context, () => {});

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toEqual({ message: 'Invalid session' });
    expect(mockRedisGet).toHaveBeenCalledWith(`session:${sessionId}`);
  });

  it('should return session data if session is valid', async () => {
    const sessionId = 'test-session-id';
    const sessionData = { userId: 'test-user-id', sessionId, createdAt: Date.now() };
    const event = {
      queryStringParameters: { sessionId },
    } as APIGatewayProxyEvent;

    const context = createMockContext();

    mockRedisGet.mockResolvedValue(JSON.stringify(sessionData));

    const response = await getSessionHandler(event, context, () => {});

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ session: sessionData });
    expect(mockRedisGet).toHaveBeenCalledWith(`session:${sessionId}`);
  });

  it('should handle Redis errors gracefully', async () => {
    const sessionId = 'test-session-id';
    const event = {
      queryStringParameters: { sessionId },
    } as APIGatewayProxyEvent;

    const context = createMockContext();

    mockRedisGet.mockRejectedValue(new Error('Redis error'));

    const response = await getSessionHandler(event, context, () => {});

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toEqual({ message: 'Invalid or expired token' });
    expect(mockRedisGet).toHaveBeenCalledWith(`session:${sessionId}`);
  });
});
