import { APIGatewayProxyHandler } from 'aws-lambda';

import redis from '../redis/redisConnection';  // Import centralized Redis connection

export const getSessionHandler: APIGatewayProxyHandler = async (event) => {
  const sessionId = event.queryStringParameters?.sessionId;

  if (!sessionId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Missing sessionId' }),
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
    return {
      statusCode: 200,
      body: JSON.stringify({ session }),
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid or expired token' }),
    };
  }
};
