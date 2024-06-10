import { APIGatewayProxyHandler } from 'aws-lambda';
import redis from '../redis/redisConnection';  // Import centralized Redis connection

export const deleteSessionHandler: APIGatewayProxyHandler = async (event) => {
  const sessionId = event.queryStringParameters?.sessionId;

  if (!sessionId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Missing token or sessionId' }),
    };
  }

  try {
    const sessionData = await redis.get(`session:${sessionId}`);

    if (!sessionData) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid session' }),
      };
    }

    const session = JSON.parse(sessionData);
    if (session.userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'User ID mismatch' }),
      };
    }

    await redis.del(`session:${sessionId}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Session deleted' }),
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid or expired session' }),
    };
  }
};
