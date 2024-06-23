import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from "aws-lambda";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { mockClient } from "aws-sdk-client-mock";
import { handler } from "../../src/service/api/handler/create-bet";
import { BetFactory } from "../bet-factory";
import { GameOutcome } from "@solspin/types";

jest.mock("../../src/foundation/runtime", () => ({
  BETS_TABLE_ARN: "mock-dynamo-db-arn",
  EVENT_BUS_ARN: "mock-event-bus-arn",
}));

const dynamoMock = mockClient(DynamoDBDocumentClient);
const eventBridgeMock = mockClient(EventBridgeClient);

describe("create-bet-handler", () => {
  beforeAll(() => {
    process.env.EVENT_BUS_ARN = "mock-event-bus-arn";
    process.env.BETS_TABLE_ARN = "mock-dynamo-db-arn";
  });

  beforeEach(() => {
    dynamoMock.reset();
    eventBridgeMock.reset();
  });

  // Happy Path Tests
  it("should create a bet successfully", async () => {
    const mockBet = BetFactory.createMockBet();
    const event: APIGatewayProxyEventV2 = {
      body: JSON.stringify(mockBet),
    } as unknown as APIGatewayProxyEventV2;

    const context: Context = {} as unknown as Context;
    const callback = jest.fn();

    dynamoMock.on(PutCommand).resolves({});
    eventBridgeMock.on(PutEventsCommand).resolves({});

    const response = (await handler(event, context, callback)) as APIGatewayProxyStructuredResultV2;

    expect(response).toEqual({
      statusCode: 200,
      body: expect.any(String),
    });

    const parsedBody = JSON.parse(response.body || "");
    expect(parsedBody).toEqual({
      id: expect.any(String),
      userId: mockBet.userId,
      gameId: mockBet.gameId,
      amountBet: mockBet.amountBet,
      outcome: mockBet.outcome,
      outcomeAmount: mockBet.outcomeAmount,
      createdAt: expect.any(String),
    });

    expect(dynamoMock.commandCalls(PutCommand).length).toBe(1);
    expect(dynamoMock.commandCalls(PutCommand)[0].args[0].input).toMatchObject({
      TableName: "mock-dynamo-db-arn",
      Item: {
        id: expect.any(String),
        userId: mockBet.userId,
        gameId: mockBet.gameId,
        amountBet: mockBet.amountBet,
        outcome: mockBet.outcome,
        outcomeAmount: mockBet.outcomeAmount,
        createdAt: expect.any(String),
      },
    });

    expect(eventBridgeMock.commandCalls(PutEventsCommand).length).toBe(1);
    expect(eventBridgeMock.commandCalls(PutEventsCommand)[0].args[0].input).toMatchObject({
      Entries: [
        {
          EventBusName: "mock-event-bus-arn",
          Source: "betting_service.BetTransaction",
          DetailType: "event",
          Detail: expect.any(String),
        },
      ],
    });
  });

  it("should create a bet with the minimum required fields", async () => {
    const mockBet = BetFactory.createMockBet({
      outcome: GameOutcome.WIN,
      outcomeAmount: 10,
    });
    const event: APIGatewayProxyEventV2 = {
      body: JSON.stringify(mockBet),
    } as unknown as APIGatewayProxyEventV2;

    const context: Context = {} as unknown as Context;
    const callback = jest.fn();

    dynamoMock.on(PutCommand).resolves({});
    eventBridgeMock.on(PutEventsCommand).resolves({});

    const response = (await handler(event, context, callback)) as APIGatewayProxyStructuredResultV2;

    expect(response.statusCode).toBe(200);
  });

  // Unhappy Path Tests
  it("should return a validation error for missing required fields", async () => {
    const mockBet = BetFactory.createMockBet({
      userId: undefined,
      gameId: undefined,
    });
    const event: APIGatewayProxyEventV2 = {
      body: JSON.stringify(mockBet),
    } as unknown as APIGatewayProxyEventV2;

    const context: Context = {} as unknown as Context;
    const callback = jest.fn();

    const response = (await handler(event, context, callback)) as APIGatewayProxyStructuredResultV2;

    expect(response.statusCode).toBe(400);
  });

  it("should return a validation error for invalid data types", async () => {
    const mockBet = BetFactory.createMockBet({
      amountBet: -1,
      outcomeAmount: -1,
    });
    const event: APIGatewayProxyEventV2 = {
      body: JSON.stringify(mockBet),
    } as unknown as APIGatewayProxyEventV2;

    const context: Context = {} as unknown as Context;
    const callback = jest.fn();

    const response = (await handler(event, context, callback)) as APIGatewayProxyStructuredResultV2;

    expect(response.statusCode).toBe(400);
    // Add more assertions as needed
  });

  // Add more unhappy path tests...

  // Validation Tests
  it("should create a bet without providing the id field", async () => {
    const mockBet = BetFactory.createMockBet({
      id: undefined,
    });
    const event: APIGatewayProxyEventV2 = {
      body: JSON.stringify(mockBet),
    } as unknown as APIGatewayProxyEventV2;

    const context: Context = {} as unknown as Context;
    const callback = jest.fn();

    dynamoMock.on(PutCommand).resolves({});
    eventBridgeMock.on(PutEventsCommand).resolves({});

    const response = (await handler(event, context, callback)) as APIGatewayProxyStructuredResultV2;

    expect(response.statusCode).toBe(200);
    // Add more assertions as needed
  });

  it("should return a validation error for an invalid userId format", async () => {
    const mockBet = BetFactory.createMockBet({
      userId: "invalid-user-id",
    });
    const event: APIGatewayProxyEventV2 = {
      body: JSON.stringify(mockBet),
    } as unknown as APIGatewayProxyEventV2;

    const context: Context = {} as unknown as Context;
    const callback = jest.fn();

    const response = (await handler(event, context, callback)) as APIGatewayProxyStructuredResultV2;

    expect(response.statusCode).toBe(400);
    // Add more assertions as needed
  });

  // Add more validation tests...
});
