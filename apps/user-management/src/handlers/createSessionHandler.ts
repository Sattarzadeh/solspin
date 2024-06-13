import { APIGatewayProxyHandler } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import redis from '../redis/redisConnection';  // Import centralized Redis connection

export const createSessionHandler: APIGatewayProxyHandler = async (event) => {
  const { userId } = JSON.parse(event.body || '{}');

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing userId' }),
    };
  }

  const sessionId = uuidv4();  
  const sessionData = { userId, sessionId, createdAt: Date.now() };

  await redis.set(`session:${sessionId}`, JSON.stringify(sessionData), 'EX', 3600);

  return {
    statusCode: 200,
    body: JSON.stringify({ sessionId }),
  };
};
