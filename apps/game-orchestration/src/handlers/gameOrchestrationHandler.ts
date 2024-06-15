import { APIGatewayProxyHandler } from 'aws-lambda';
import { callIsAuthorized } from '../helpers/isAuthorizedHelper';
import { callGetBalance } from '../helpers/getBalanceHelper';
import { callGetCase } from '../helpers/getCaseHelper'; // Import the new helper
import { webSocketPayload } from '../models/websocketPayload';
import { getUserFromWebSocket } from '../helpers/getUserFromWebsocketHelper';
import { performSpinHelper } from '../helpers/performSpinHelper';
import { WebsocketConnection } from '../models/websocketConnection';
import { CaseItem } from '../models/caseItemModel';

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
    const user: WebsocketConnection = await getUserFromWebSocket(sid);

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
      // If balance is sufficient, perform spin

      const caseItem: CaseItem = await performSpinHelper(
        clientSeed,
        serverSeed,
        caseData
      );

      let newBalance = balancePayload.balance - casePrice;
      newBalance = balancePayload.balance + caseItem.price;

      // Record bet and send to front end for live drop feed

      return {
        statusCode: 200,
        body: JSON.stringify({
          caseItem,
        }),
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
