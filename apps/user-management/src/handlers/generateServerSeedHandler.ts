import { APIGatewayProxyHandler } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import redis from '../redis/redisConnection';  // Import centralized Redis connection

const generateServerSeed = () => crypto.randomBytes(32).toString('hex');

export const generateServerSeedHandler: APIGatewayProxyHandler = async (event) => {
  const { sessionId } = JSON.parse(event.body || '{}');

  if (!sessionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing sessionId' }),
    };
  }

  const sessionData = await redis.get(`session:${sessionId}`);

  if (!sessionData) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid session' }),
    };
  }

  const session = JSON.parse(sessionData);
  const serverSeed = generateServerSeed();
  session.serverSeed = serverSeed;

  await redis.set(`session:${sessionId}`, JSON.stringify(session), 'EX', 3600);

  return {
    statusCode: 200,
    body: JSON.stringify({ serverSeed }),
  };
};
