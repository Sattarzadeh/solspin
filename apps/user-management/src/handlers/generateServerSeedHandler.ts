import { APIGatewayProxyHandler } from 'aws-lambda';
import crypto from 'crypto';
import redis from '../redis/redisConnection';

const generateServerSeed = () => crypto.randomBytes(32).toString('hex');

export const generateServerSeedHandler: APIGatewayProxyHandler = async (
  event
) => {
  console.log('Event received:', event);

  const { sessionId } = JSON.parse(event.body || '{}');

  if (!sessionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing sessionId' }),
    };
  }

  try {
    const sessionData = await redis.get(`session:${sessionId}`);
    console.log('Session data:', sessionData);

    if (!sessionData) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid session' }),
      };
    }

    const session = JSON.parse(sessionData);
    const serverSeed = generateServerSeed();
    session.serverSeed = serverSeed;

    await redis.set(
      `session:${sessionId}`,
      JSON.stringify(session),
      'EX',
      3600
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ serverSeed }),
    };
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
