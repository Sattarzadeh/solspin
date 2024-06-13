import { APIGatewayProxyHandler } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import { Table } from 'sst/node/table';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  const { userId } = JSON.parse(event.body || '{}');

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing userId' }),
    };
  }

  const sessionId = uuidv4();
  const sessionData = {
    sessionId,
    userId,
    createdAt: Date.now().toString(),
    serverSeed: '',
  };

  const putParams = {
    TableName: Table.Sessions.tableName, // Reference the table name dynamically
    Item: sessionData,
  };

  try {
    await dynamoDb.put(putParams).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId }),
    };
  } catch (error) {
    console.error('Error creating session:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
