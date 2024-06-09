import { DatabaseHandlerService } from '../helpers/dbHelper';
import { CaseType } from '../enums/caseType';
import { mockCase } from '../mock/case_pot_of_gold.mock';
import dynamoDB from '../db/dbConnection';

import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

jest.mock('../db/dbConnection', () => ({
  send: jest.fn(),
}));

describe('DatabaseHandlerService', () => {
  let service: DatabaseHandlerService;
  const tableName = 'cases';

  beforeAll(() => {
    process.env.AWS_CASE_TABLE_NAME = tableName;
    service = new DatabaseHandlerService();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('addCase', () => {
    it('should add a new case to the database', async () => {
      (dynamoDB.send as jest.Mock).mockResolvedValueOnce({});

      await expect(
        service.addCase(
          mockCase.caseName,
          mockCase.casePrice,
          mockCase.caseType,
          mockCase.image_url,
          mockCase.items
        )
      ).resolves.not.toThrow();

      expect(dynamoDB.send).toHaveBeenCalledWith(expect.any(PutCommand));
    });
  });

  describe('getCase', () => {
    it('should retrieve a case by ID', async () => {
      (dynamoDB.send as jest.Mock).mockResolvedValueOnce({ Item: mockCase });

      const result = await service.getCase(mockCase.caseId);
      expect(result).toEqual(mockCase);
      expect(dynamoDB.send).toHaveBeenCalledWith(expect.any(GetCommand));
    });

    it('should throw an error if case is not found', async () => {
      (dynamoDB.send as jest.Mock).mockResolvedValueOnce({});

      await expect(service.getCase('non-existent-id')).rejects.toThrow('Case was not found');
      expect(dynamoDB.send).toHaveBeenCalledWith(expect.any(GetCommand));
    });
  });

  describe('listCases', () => {
    it('should list all cases', async () => {
      (dynamoDB.send as jest.Mock).mockResolvedValueOnce({ Items: [mockCase] });

      const result = await service.listCases();
      expect(result).toEqual([mockCase]);
      expect(dynamoDB.send).toHaveBeenCalledWith(expect.any(QueryCommand));
    });

    it('should throw an error if fetching cases fails', async () => {
      (dynamoDB.send as jest.Mock).mockRejectedValueOnce(new Error('DynamoDB error'));

      await expect(service.listCases()).rejects.toThrow('Could not fetch cases');
      expect(dynamoDB.send).toHaveBeenCalledWith(expect.any(QueryCommand));
    });
  });

  describe('initializeDatabase', () => {
    it('should initialize the database with mock data', async () => {
      (dynamoDB.send as jest.Mock).mockResolvedValueOnce({});

      await expect(service.initializeDatabase()).resolves.not.toThrow();
      expect(dynamoDB.send).toHaveBeenCalledWith(expect.any(PutCommand));
    });
  });
});
