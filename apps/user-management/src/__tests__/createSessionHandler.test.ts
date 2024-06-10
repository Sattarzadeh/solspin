import { APIGatewayProxyEvent } from 'aws-lambda';
import createMockContext from 'aws-lambda-mock-context';
import { createSessionHandler } from '../handlers/createSessionHandler';
import redis from '../redis/redisConnection';
import { v4 as uuidv4 } from 'uuid';

// Mock dependencies
jest.mock('../redis/redisConnection');
jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const mockRedisSet = redis.set as jest.Mock;
const mockUuidv4 = uuidv4 as jest.Mock;

describe('createSessionHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if userId is missing', async () => {
    const event = {
      body: '{}',
    } as APIGatewayProxyEvent;

    const context = createMockContext();
    const response = await createSessionHandler(event, context, () => {});

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({ message: 'Missing userId' });
  });

  it('should create a session and return sessionId', async () => {
    const userId = 'test-user-id';
    const sessionId = 'test-session-id';
    const event = {
      body: JSON.stringify({ userId }),
    } as APIGatewayProxyEvent;

    const context = createMockContext();

    mockUuidv4.mockReturnValue(sessionId);
    mockRedisSet.mockResolvedValue('OK');

    const response = await createSessionHandler(event, context, () => {});

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ sessionId });
    expect(mockUuidv4).toHaveBeenCalled();
    expect(mockRedisSet).toHaveBeenCalledWith(
      `session:${sessionId}`,
      JSON.stringify({ userId, sessionId, createdAt: expect.any(Number) }),
      'EX',
      3600
    );
  });

  it('should handle Redis errors gracefully', async () => {
    const userId = 'test-user-id';
    const sessionId = 'test-session-id';
    const event = {
      body: JSON.stringify({ userId }),
    } as APIGatewayProxyEvent;

    const context = createMockContext();

    mockUuidv4.mockReturnValue(sessionId);
    mockRedisSet.mockRejectedValue(new Error('Redis error'));

    const response = await createSessionHandler(event, context, () => {});

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ message: 'Internal Server Error' });
    expect(mockUuidv4).toHaveBeenCalled();
    expect(mockRedisSet).toHaveBeenCalledWith(
      `session:${sessionId}`,
      JSON.stringify({ userId, sessionId, createdAt: expect.any(Number) }),
      'EX',
      3600
    );
  });
});
