import { APIGatewayProxyHandler } from 'aws-lambda';
import { callIsAuthorized } from '../helpers/isAuthorizedHelper';
import { callGetBalance } from '../helpers/getBalanceHelper';
import { callGetCase } from '../helpers/getCaseHelper'; // Import the new helper
import { sendMessageToSQS } from '../helpers/sendSqsMessage';
import { webSocketPayload } from '../models/websocketPayload';

const QUEUE_URL =
  'https://sqs.<region>.amazonaws.com/<account-id>/<queue-name>'; // Replace with your SQS Queue URL

export const gameOrchestrationHandler: APIGatewayProxyHandler = async (
  event
) => {
  let payload: webSocketPayload;

  try {
    payload = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid JSON format' }),
    };
  }

  const { caseId, clientSeed, sid } = payload;

  if (!caseId || clientSeed === undefined || !sid) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'caseId, clientSeed, or sid is missing',
      }),
    };
  }

  try {
    // Call the isAuthorized Lambda function
    const user = await getUserFromWebSocket(token);

    if (!user || !user.isAuthorized) {
      return {
        statusCode: 403,
        body: JSON.stringify({ isAuthorized: false, message: 'Unauthorized' }),
      };
    }

    if (!user.serverSeed) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message:
            'Server seed is missing. Please request a server seed before opening a case.',
        }),
      };
    }

    const userId = user.userId;

    const serverSeed = user.serverSeed;

    // Call the getCaseHandler Lambda function to retrieve case details
    const caseData = await callGetCase(caseId);

    if (caseData.statusCode !== 200) {
      throw new Error('Failed to fetch case details');
    }

    const casePrice = JSON.parse(caseData.body).casePrice;

    // Call the getBalance Lambda function
    const balancePayload = await callGetBalance(userId);

    if (balancePayload.balance >= casePrice) {
      // If balance is sufficient, send a message to the SQS queue
      const messageBody = {
        userId,
        caseId,
        casePrice,
        clientSeed,
        serverSeed,
        timestamp: new Date().toISOString(),
      };

      // Spin here
    } else {
      return {
        statusCode: 403,
        body: JSON.stringify({
          isAuthorized: true,
          message: 'Insufficient balance',
        }),
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
