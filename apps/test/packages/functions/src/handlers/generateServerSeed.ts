import { APIGatewayProxyHandler } from 'aws-lambda';
import crypto from 'crypto';
import AWS from 'aws-sdk';
import { Table } from 'sst/node/table';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const generateServerSeed = () => crypto.randomBytes(32).toString('hex');

export const handler: APIGatewayProxyHandler = async (event) => {
  const { sessionId } = JSON.parse(event.body || '{}');
  console.log('sessionId:', sessionId);
  if (!sessionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing sessionId' }),
    };
  }

  try {
    // Retrieve session data from DynamoDB
    const getParams = {
      TableName: Table.Sessions.tableName,
      Key: {
        sessionId,
      },
    };
    const results = await dynamoDb.get(getParams).promise();
    console.log(results);
    if (!results.Item) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid session' }),
      };
    }

    const session = results.Item;
    const serverSeed = generateServerSeed();
    session.serverSeed = serverSeed;

    // Update the session data with new serverSeed
    await dynamoDb
      .put({
        TableName: Table.Sessions.tableName, // Correctly reference the table name
        Item: session,
      })
      .promise();

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
