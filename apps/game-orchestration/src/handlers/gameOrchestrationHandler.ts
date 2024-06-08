import { APIGatewayProxyHandler } from 'aws-lambda';
import { callIsAuthorized } from '../helpers/isAuthorizedHelper';
import { callGetBalance } from '../helpers/getBalanceHelper';
import { sendMessageToSQS } from '../helpers/sendSqsMessage';
import { webSocketPayload } from '../models/webSocketPayload';

const QUEUE_URL = 'https://sqs.<region>.amazonaws.com/<account-id>/<queue-name>'; // Replace with your SQS Queue URL

export const gameOrchestrationHandler: APIGatewayProxyHandler = async (event) => {
  let payload: webSocketPayload;

  try {
    payload = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid JSON format' }),
    };
  }

  const { token, caseId, clientSeed, serverSeedHash } = payload;

  if (!token || !caseId || clientSeed === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Token, caseId, or clientSeed is missing' }),
    };
  }

  try {
    // Call the isAuthorized Lambda function
    const authPayload = await callIsAuthorized(token);

    if (!authPayload.isAuthorized) {
      return {
        statusCode: 403,
        body: JSON.stringify({ isAuthorized: false, message: 'Unauthorized' }),
      };
    }

    const userId = authPayload.userId; // Assuming the payload contains userId

    // Call the getBalance Lambda function
    const balancePayload = await callGetBalance(userId);
    // interface with the dynamodb table holding the cases to get the casePrice
    const casePrice = 100;
    if (balancePayload.balance >= casePrice) {
      // If balance is sufficient, send a message to the SQS queue
      const messageBody = {
        userId,
        caseId,
        casePrice,
        clientSeed,
        serverSeedHash,
        timestamp: new Date().toISOString(),
      };

      try {
        const sqsResponse = await sendMessageToSQS(QUEUE_URL, messageBody);
        console.log('SQS send message response:', sqsResponse);
        return {
          statusCode: 200,
          body: JSON.stringify({ isAuthorized: true, messageId: sqsResponse.MessageId }),
        };
      } catch (sqsError) {
        console.error('Error sending message to SQS:', sqsError);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to send message to SQS' }),
        };
      }
    } else {
      return {
        statusCode: 403,
        body: JSON.stringify({ isAuthorized: true, message: 'Insufficient balance' }),
      };
    }
  } catch (error) {
    console.error('Error in orchestration handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
