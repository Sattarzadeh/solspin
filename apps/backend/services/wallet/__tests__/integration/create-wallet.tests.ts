// import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from "aws-lambda";
// import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
// import { mockClient } from "aws-sdk-client-mock";
// import { handler } from "../../src/service/api/handler/create-wallet";
// import { WalletFactory } from "../wallet-factory";
//
// jest.mock("../../src/foundation/runtime", () => ({
//   WALLETS_TABLE_ARN: "mock-dynamo-db-arn",
// }));
//
// const dynamoMock = mockClient(DynamoDBDocumentClient);
//
// describe("create-wallet-handler", () => {
//   beforeAll(() => {
//     process.env.WALLETS_TABLE_ARN = "mock-dynamo-db-arn";
//   });
//
//   beforeEach(() => {
//     dynamoMock.reset();
//   });
//
//   // Happy Path Tests
//   it("should create a wallet successfully", async () => {
//     const mockWallet = WalletFactory.createMockWallet();
//     const event: APIGatewayProxyEventV2 = {
//       body: JSON.stringify({
//         userId: mockWallet.userId,
//         walletAddress: mockWallet.walletAddress,
//       }),
//     } as unknown as APIGatewayProxyEventV2;
//
//     const context: Context = {} as unknown as Context;
//     const callback = jest.fn();
//
//     dynamoMock.on(PutCommand).resolves({});
//
//     const response = (await handler(event, context, callback)) as APIGatewayProxyStructuredResultV2;
//
//     expect(response.statusCode).toBe(200);
//     const body = JSON.parse(response.body || "");
//     expect(body).toMatchObject({
//       userId: mockWallet.userId,
//       balance: 0,
//       wagerRequirement: 0,
//       walletAddress: mockWallet.walletAddress,
//       createdAt: expect.any(String),
//       lockedAt: "0",
//     });
//
//     expect(dynamoMock.commandCalls(PutCommand).length).toBe(1);
//     expect(dynamoMock.commandCalls(PutCommand)[0].args[0].input).toMatchObject({
//       TableName: "mock-dynamo-db-arn",
//       Item: expect.objectContaining({
//         userId: mockWallet.userId,
//         balance: 0,
//         wagerRequirement: 0,
//         walletAddress: mockWallet.walletAddress,
//         createdAt: expect.any(String),
//         lockedAt: "0",
//       }),
//     });
//   });
//
//   it("should create a wallet without a wallet address", async () => {
//     const mockWallet = WalletFactory.createMockWallet({ walletAddress: undefined });
//     const event: APIGatewayProxyEventV2 = {
//       body: JSON.stringify({ userId: mockWallet.userId }),
//     } as unknown as APIGatewayProxyEventV2;
//
//     dynamoMock.on(PutCommand).resolves({});
//     const callback = jest.fn();
//
//     const response = (await handler(
//       event,
//       {} as Context,
//       callback
//     )) as APIGatewayProxyStructuredResultV2;
//
//     expect(response.statusCode).toBe(200);
//     const body = JSON.parse(response.body || "");
//     expect(body.walletAddress).toBe("");
//   });
//
//   // Unhappy Path Tests
//   it("should return a validation error for missing userId", async () => {
//     const event: APIGatewayProxyEventV2 = {
//       body: JSON.stringify({ walletAddress: "some-address" }),
//     } as unknown as APIGatewayProxyEventV2;
//
//     const callback = jest.fn();
//
//     const response = (await handler(
//       event,
//       {} as Context,
//       callback
//     )) as APIGatewayProxyStructuredResultV2;
//
//     expect(response.statusCode).toBe(400);
//     expect(JSON.parse(response.body || "").error).toContain("userId");
//   });
//
//   it("should return a validation error for invalid userId format", async () => {
//     const event: APIGatewayProxyEventV2 = {
//       body: JSON.stringify({ userId: "invalid-uuid", walletAddress: "some-address" }),
//     } as unknown as APIGatewayProxyEventV2;
//
//     const callback = jest.fn();
//
//     const response = (await handler(
//       event,
//       {} as Context,
//       callback
//     )) as APIGatewayProxyStructuredResultV2;
//
//     expect(response.statusCode).toBe(400);
//     expect(JSON.parse(response.body || "").error).toContain("userId");
//   });
//
//   it("should handle DynamoDB errors", async () => {
//     const mockWallet = WalletFactory.createMockWallet();
//     const event: APIGatewayProxyEventV2 = {
//       body: JSON.stringify({
//         userId: mockWallet.userId,
//         walletAddress: mockWallet.walletAddress,
//       }),
//     } as unknown as APIGatewayProxyEventV2;
//
//     const callback = jest.fn();
//     dynamoMock.on(PutCommand).rejects(new Error("DynamoDB error"));
//
//     const response = (await handler(
//       event,
//       {} as Context,
//       callback
//     )) as APIGatewayProxyStructuredResultV2;
//
//     expect(response.statusCode).toBe(500);
//     expect(JSON.parse(response.body || "").error).toContain("Error creating wallet");
//   });
//
//   it("should handle invalid JSON in request body", async () => {
//     const event: APIGatewayProxyEventV2 = {
//       body: "invalid-json",
//     } as unknown as APIGatewayProxyEventV2;
//
//     const callback = jest.fn();
//     const response = (await handler(
//       event,
//       {} as Context,
//       callback
//     )) as APIGatewayProxyStructuredResultV2;
//
//     expect(response.statusCode).toBe(500);
//     expect(JSON.parse(response.body || "").error).toContain("Unexpected token");
//   });
//
//   // Additional tests
//   it("should handle empty request body", async () => {
//     const event: APIGatewayProxyEventV2 = {} as unknown as APIGatewayProxyEventV2;
//
//     const callback = jest.fn();
//     const response = (await handler(
//       event,
//       {} as Context,
//       callback
//     )) as APIGatewayProxyStructuredResultV2;
//
//     expect(response.statusCode).toBe(400);
//     expect(JSON.parse(response.body || "").error).toContain("userId");
//   });
//
//   it("should ignore additional fields in request", async () => {
//     const mockWallet = WalletFactory.createMockWallet();
//     const event: APIGatewayProxyEventV2 = {
//       body: JSON.stringify({
//         userId: mockWallet.userId,
//         walletAddress: mockWallet.walletAddress,
//         extraField: "should be ignored",
//       }),
//     } as unknown as APIGatewayProxyEventV2;
//
//     dynamoMock.on(PutCommand).resolves({});
//     const callback = jest.fn();
//
//     const response = (await handler(
//       event,
//       {} as Context,
//       callback
//     )) as APIGatewayProxyStructuredResultV2;
//
//     expect(response.statusCode).toBe(200);
//     const body = JSON.parse(response.body || "");
//     expect(body).not.toHaveProperty("extraField");
//   });
// });
