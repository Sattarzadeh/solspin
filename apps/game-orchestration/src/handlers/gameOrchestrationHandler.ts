import { APIGatewayProxyHandler } from 'aws-lambda';
import { callIsAuthorized } from '../helpers/isAuthorizedHelper';
import { callGetBalance } from '../helpers/getBalanceHelper';
import { sendMessageToSQS } from '../helpers/sendSqsMessage';

const QUEUE_URL = 'https://sqs.<region>.amazonaws.com/<account-id>/<queue-name>'; // Replace with your SQS Queue URL

export const gameOrchestrationHandler: APIGatewayProxyHandler = async (event) => {
    // change this to include clientseed, serverseedhash etc
    const { token, caseId, casePrice } = JSON.parse(event.body);

    if (!token || !caseId || !casePrice) {
        return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Token, caseId, or casePrice is missing' }),
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

        if (balancePayload.balance >= casePrice) {
        // If balance is sufficient, send a message to the SQS queue
        const messageBody = {
            userId,
            caseId,
            casePrice,
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
