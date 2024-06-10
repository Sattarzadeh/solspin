import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { gameOrchestrationHandler } from '../handlers/gameOrchestrationHandler';
import { callIsAuthorized } from '../helpers/isAuthorizedHelper';
import { callGetBalance } from '../helpers/getBalanceHelper';
import { callGetCase } from '../helpers/getCaseHelper';
import { sendMessageToSQS } from '../helpers/sendSqsMessage';
import redis from '../redis/redisConnection';

jest.mock('../helpers/isAuthorizedHelper');
jest.mock('../helpers/getBalanceHelper');
jest.mock('../helpers/getCaseHelper');
jest.mock('../helpers/sendSqsMessage');
jest.mock('../redis/redisConnection');

const mockEvent = (body: any): APIGatewayProxyEvent => ({
  body: JSON.stringify(body),
  headers: {},
  multiValueHeaders: {},
  httpMethod: 'POST',
  isBase64Encoded: false,
  path: '',
  pathParameters: null,
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: null,
  resource: '',
});

const context: Context = {} as any;

describe('gameOrchestrationHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if JSON is invalid', async () => {
    const event = mockEvent('invalid JSON');
    const response = await gameOrchestrationHandler(event, context, null);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(JSON.stringify({ message: 'Invalid JSON format' }));
  });

  it('should return 400 if required fields are missing', async () => {
    const event = mockEvent({});
    const response = await gameOrchestrationHandler(event, context, null);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(JSON.stringify({ message: 'Token, caseId, clientSeed, or sessionId is missing' }));
  });

  it('should return 403 if user is not authorized', async () => {
    (callIsAuthorized as jest.Mock).mockResolvedValueOnce({ isAuthorized: false });

    const event = mockEvent({ token: 'token', caseId: 'caseId', clientSeed: 'clientSeed', sessionId: 'sessionId' });
    const response = await gameOrchestrationHandler(event, context, null);

    expect(response.statusCode).toBe(403);
    expect(response.body).toBe(JSON.stringify({ isAuthorized: false, message: 'Unauthorized' }));
  });

  it('should return 401 if session is invalid', async () => {
    (callIsAuthorized as jest.Mock).mockResolvedValueOnce({ isAuthorized: true, userId: 'userId' });
    (redis.get as jest.Mock).mockResolvedValueOnce(null);

    const event = mockEvent({ token: 'token', caseId: 'caseId', clientSeed: 'clientSeed', sessionId: 'sessionId' });
    const response = await gameOrchestrationHandler(event, context, null);

    expect(response.statusCode).toBe(401);
    expect(response.body).toBe(JSON.stringify({ message: 'Invalid session' }));
  });

  it('should return 400 if server seed is missing', async () => {
    (callIsAuthorized as jest.Mock).mockResolvedValueOnce({ isAuthorized: true, userId: 'userId' });
    (redis.get as jest.Mock).mockResolvedValueOnce(JSON.stringify({ userId: 'userId', sessionId: 'sessionId' }));

    const event = mockEvent({ token: 'token', caseId: 'caseId', clientSeed: 'clientSeed', sessionId: 'sessionId' });
    const response = await gameOrchestrationHandler(event, context, null);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(JSON.stringify({ message: 'Server seed is missing. Please request a server seed before opening a case.' }));
  });

  it('should return 403 if balance is insufficient', async () => {
    (callIsAuthorized as jest.Mock).mockResolvedValueOnce({ isAuthorized: true, userId: 'userId' });
    (redis.get as jest.Mock).mockResolvedValueOnce(JSON.stringify({ userId: 'userId', sessionId: 'sessionId', serverSeed: 'serverSeed' }));
    (callGetCase as jest.Mock).mockResolvedValueOnce({ statusCode: 200, body: JSON.stringify({ casePrice: 200 }) });
    (callGetBalance as jest.Mock).mockResolvedValueOnce({ balance: 100 });

    const event = mockEvent({ token: 'token', caseId: 'caseId', clientSeed: 'clientSeed', sessionId: 'sessionId' });
    const response = await gameOrchestrationHandler(event, context, null);

    expect(response.statusCode).toBe(403);
    expect(response.body).toBe(JSON.stringify({ isAuthorized: true, message: 'Insufficient balance' }));
  });

  it('should send message to SQS and return 200 if all conditions are met', async () => {
    (callIsAuthorized as jest.Mock).mockResolvedValueOnce({ isAuthorized: true, userId: 'userId' });
    (redis.get as jest.Mock).mockResolvedValueOnce(JSON.stringify({ userId: 'userId', sessionId: 'sessionId', serverSeed: 'serverSeed' }));
    (callGetCase as jest.Mock).mockResolvedValueOnce({ statusCode: 200, body: JSON.stringify({ casePrice: 100 }) });
    (callGetBalance as jest.Mock).mockResolvedValueOnce({ balance: 200 });
    (sendMessageToSQS as jest.Mock).mockResolvedValueOnce({ MessageId: 'messageId' });

    const event = mockEvent({ token: 'token', caseId: 'caseId', clientSeed: 'clientSeed', sessionId: 'sessionId' });
    const response = await gameOrchestrationHandler(event, context, null);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(JSON.stringify({ isAuthorized: true, messageId: 'messageId' }));
  });

  it('should return 500 if there is an error in SQS', async () => {
    (callIsAuthorized as jest.Mock).mockResolvedValueOnce({ isAuthorized: true, userId: 'userId' });
    (redis.get as jest.Mock).mockResolvedValueOnce(JSON.stringify({ userId: 'userId', sessionId: 'sessionId', serverSeed: 'serverSeed' }));
    (callGetCase as jest.Mock).mockResolvedValueOnce({ statusCode: 200, body: JSON.stringify({ casePrice: 100 }) });
    (callGetBalance as jest.Mock).mockResolvedValueOnce({ balance: 200 });
    (sendMessageToSQS as jest.Mock).mockRejectedValueOnce(new Error('SQS error'));

    const event = mockEvent({ token: 'token', caseId: 'caseId', clientSeed: 'clientSeed', sessionId: 'sessionId' });
    const response = await gameOrchestrationHandler(event, context, null);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBe(JSON.stringify({ error: 'Failed to send message to SQS' }));
  });

  it('should return 500 if there is an internal server error', async () => {
    (callIsAuthorized as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Internal error');
    });

    const event = mockEvent({ token: 'token', caseId: 'caseId', clientSeed: 'clientSeed', sessionId: 'sessionId' });
    const response = await gameOrchestrationHandler(event, context, null);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBe(JSON.stringify({ message: 'Internal Server Error' }));
  });
});
