import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Determine if we are in a test environment
const isTestEnvironment = process.env.NODE_ENV === 'development';

// Create the DynamoDB client configuration
const clientConfig = isTestEnvironment
  ? {
      region: 'us-north-1',
      endpoint: 'http://localhost:8000', // Local DynamoDB endpoint for testing
      credentials: {
        accessKeyId: 'test', // Dummy access key for local DynamoDB
        secretAccessKey: 'test', // Dummy secret key for local DynamoDB
      },
    }
  : {
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    };

// Create the DynamoDB client
const client = new DynamoDBClient(clientConfig);

// Create the DynamoDB Document client
const dynamoDBDocumentClient = DynamoDBDocumentClient.from(client);

export default dynamoDBDocumentClient;
