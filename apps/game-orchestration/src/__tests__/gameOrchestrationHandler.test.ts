import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { gameOrchestrationHandler } from '../handlers/gameOrchestrationHandler';
import { callIsAuthorized } from '../helpers/isAuthorizedHelper';
import { callGetBalance } from '../helpers/getBalanceHelper';
import { callGetCase } from '../helpers/getCaseHelper';
import { sendMessageToSQS } from '../helpers/sendSqsMessage';

jest.mock('../path/to/helpers/isAuthorizedHelper');
jest.mock('../path/to/helpers/getBalanceHelper');
jest.mock('../path/to/helpers/getCaseHelper');
jest.mock('../path/to/helpers/sendSqsMessage');

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
    expect(response.body).toBe(JSON.stringify({ message: 'Token, caseId, or clientSeed is missing' }));
  });

  it('should return 403 if user is not authorized', async () => {
    (callIsAuthorized as jest.Mock).mockResolvedValueOnce({ isAuthorized: false });

    const event = mockEvent({ token: 'token', caseId: 'caseId', clientSeed: 'clientSeed', serverSeedHash: 'serverSeedHash' });
    const response = await gameOrchestrationHandler(event, context, null);

    expect(response.statusCode).toBe(403);
    expect(response.body).toBe(JSON.stringify({ isAuthorized: false, message: 'Unauthorized' }));
  });

  it('should return 403 if balance is insufficient', async () => {
    (callIsAuthorized as jest.Mock).mockResolvedValueOnce({ isAuthorized: true, userId: 'userId' });
    (callGetCase as jest.Mock).mockResolvedValueOnce({ statusCode: 200, body: JSON.stringify({ casePrice: 200 }) });
    (callGetBalance as jest.Mock).mockResolvedValueOnce({ balance: 100 });

    const event = mockEvent({ token: 'token', caseId: 'caseId', clientSeed: 'clientSeed', serverSeedHash: 'serverSeedHash' });
    const response = await gameOrchestrationHandler(event, context, null);

    expect(response.statusCode).toBe(403);
    expect(response.body).toBe(JSON.stringify({ isAuthorized: true, message: 'Insufficient balance' }));
  });

  it('should send message to SQS and return 200 if all conditions are met', async () => {
    (callIsAuthorized as jest.Mock).mockResolvedValueOnce({ isAuthorized: true, userId: 'userId' });
    (callGetCase as jest.Mock).mockResolvedValueOnce({ statusCode: 200, body: JSON.stringify({ casePrice: 100 }) });
    (callGetBalance as jest.Mock).mockResolvedValueOnce({ balance: 200 });
    (sendMessageToSQS as jest.Mock).mockResolvedValueOnce({ MessageId: 'messageId' });

    const event = mockEvent({ token: 'token', caseId: 'caseId', clientSeed: 'clientSeed', serverSeedHash: 'serverSeedHash' });
    const response = await gameOrchestrationHandler(event, context, null);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(JSON.stringify({ isAuthorized: true, messageId: 'messageId' }));
  });

  it('should return 500 if there is an error in SQS', async () => {
    (callIsAuthorized as jest.Mock).mockResolvedValueOnce({ isAuthorized: true, userId: 'userId' });
    (callGetCase as jest.Mock).mockResolvedValueOnce({ statusCode: 200, body: JSON.stringify({ casePrice: 100 }) });
    (callGetBalance as jest.Mock).mockResolvedValueOnce({ balance: 200 });
    (sendMessageToSQS as jest.Mock).mockRejectedValueOnce(new Error('SQS error'));

    const event = mockEvent({ token: 'token', caseId: 'caseId', clientSeed: 'clientSeed', serverSeedHash: 'serverSeedHash' });
    const response = await gameOrchestrationHandler(event, context, null);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBe(JSON.stringify({ error: 'Failed to send message to SQS' }));
  });

  it('should return 500 if there is an internal server error', async () => {
    (callIsAuthorized as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Internal error');
    });

    const event = mockEvent({ token: 'token', caseId: 'caseId', clientSeed: 'clientSeed', serverSeedHash: 'serverSeedHash' });
    const response = await gameOrchestrationHandler(event, context, null);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBe(JSON.stringify({ message: 'Internal Server Error' }));
  });
});
