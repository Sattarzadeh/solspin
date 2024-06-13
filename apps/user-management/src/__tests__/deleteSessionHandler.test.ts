import { APIGatewayProxyEvent } from 'aws-lambda';
import createMockContext from 'aws-lambda-mock-context';
import { deleteSessionHandler } from '../handlers/deleteSessionHandler';
import redis from '../redis/redisConnection';

// Mock dependencies
jest.mock('../redis/redisConnection');

const mockRedisGet = redis.get as jest.Mock;
const mockRedisDel = redis.del as jest.Mock;

describe('deleteSessionHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if sessionId is missing', async () => {
    const event = {
      queryStringParameters: {},
    } as APIGatewayProxyEvent;

    const context = createMockContext();
    const response = await deleteSessionHandler(event, context, () => {});

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toEqual({ message: 'Missing token or sessionId' });
  });

  it('should return 401 if session is invalid', async () => {
    const sessionId = 'test-session-id';
    const event = {
      queryStringParameters: { sessionId },
    } as APIGatewayProxyEvent;

    const context = createMockContext();

    mockRedisGet.mockResolvedValue(null);

    const response = await deleteSessionHandler(event, context, () => {});

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toEqual({ message: 'Invalid session' });
    expect(mockRedisGet).toHaveBeenCalledWith(`session:${sessionId}`);
  });

  it('should return 401 if user ID does not match', async () => {
    const sessionId = 'test-session-id';
    const sessionData = { userId: 'different-user-id', sessionId, createdAt: Date.now() };
    const event = {
      queryStringParameters: { sessionId },
    } as APIGatewayProxyEvent;

    const context = createMockContext();

    mockRedisGet.mockResolvedValue(JSON.stringify(sessionData));

    const response = await deleteSessionHandler(event, context, () => {});

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toEqual({ message: 'User ID mismatch' });
    expect(mockRedisGet).toHaveBeenCalledWith(`session:${sessionId}`);
  });

  it('should delete session and return success message', async () => {
    const sessionId = 'test-session-id';
    const sessionData = { userId: 'test-user-id', sessionId, createdAt: Date.now() };
    const event = {
      queryStringParameters: { sessionId },
    } as APIGatewayProxyEvent;

    const context = createMockContext();

    mockRedisGet.mockResolvedValue(JSON.stringify(sessionData));
    mockRedisDel.mockResolvedValue(1);

    const response = await deleteSessionHandler(event, context, () => {});

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ message: 'Session deleted' });
    expect(mockRedisGet).toHaveBeenCalledWith(`session:${sessionId}`);
    expect(mockRedisDel).toHaveBeenCalledWith(`session:${sessionId}`);
  });

  it('should handle Redis errors gracefully', async () => {
    const sessionId = 'test-session-id';
    const event = {
      queryStringParameters: { sessionId },
    } as APIGatewayProxyEvent;

    const context = createMockContext();

    mockRedisGet.mockRejectedValue(new Error('Redis error'));

    const response = await deleteSessionHandler(event, context, () => {});

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toEqual({ message: 'Invalid or expired session' });
    expect(mockRedisGet).toHaveBeenCalledWith(`session:${sessionId}`);
  });
});
