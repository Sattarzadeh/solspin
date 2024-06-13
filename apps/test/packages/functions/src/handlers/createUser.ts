import { APIGatewayProxyHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { DynamoDbService } from '../services/dynamoDbService';

const dynamoDbService = new DynamoDbService();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { walletAddress } = JSON.parse(event.body || '{}');

    if (!walletAddress) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing walletAddress' }),
      };
    }

    const userId = randomUUID();

    await dynamoDbService.createWallet(walletAddress, userId);

    const newUser = {
      userId: userId,
      username: walletAddress,
      discordName: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const userParams = dynamoDbService.buildCreateParams('users', newUser);
    const result = await dynamoDbService.createRecord(userParams);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
