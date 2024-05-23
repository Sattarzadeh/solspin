import AWS from 'aws-sdk';

AWS.config.update({
  region: 'eu-west-1', // e.g., 'us-east-1'
});

const dynamoDBClient = new AWS.DynamoDB.DocumentClient();

export default dynamoDBClient;