import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDbService } from '../services/dynamoDbService';

const dynamoDbService = new DynamoDbService();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { userId, updateFields } = JSON.parse(event.body || '{}');

    if (!userId || !updateFields) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing user_id or updateFields' }),
      };
    }

    const key = { userId };
    const updateParams = dynamoDbService.buildUpdateParams(
      'users',
      key,
      updateFields
    );
    const result = await dynamoDbService.updateRecord(updateParams);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error updating user data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
