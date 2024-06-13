import { APIGatewayProxyHandler } from 'aws-lambda';
import AWS from 'aws-sdk';
import { Table } from 'sst/node/table';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  const sessionId = event.queryStringParameters?.sessionId;

  if (!sessionId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Missing sessionId' }),
    };
  }

  try {
    // Retrieve session data from DynamoDB
    const getParams = {
      TableName: Table.Sessions.tableName, // Reference the table name dynamically
      Key: {
        sessionId,
      },
    };
    const sessionData = await dynamoDb.get(getParams).promise();

    if (!sessionData.Item) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid session' }),
      };
    }

    const session = sessionData.Item;
    return {
      statusCode: 200,
      body: JSON.stringify({ session }),
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
