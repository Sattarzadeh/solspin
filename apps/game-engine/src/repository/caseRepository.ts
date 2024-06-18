import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { CaseItem } from "../models/case_item_model";
import { Case, CaseOverview } from "../models/case_model";
import { CaseType } from "../enums/caseType";
import { randomUUID } from "crypto";
import { mockCase } from "../mock/case_pot_of_gold.mock";
import { CaseDoesNotExistError, EnvironmentVariableError, FetchCasesError } from "@solspin/errors"; // Update with actual path
import logger from "@solspin/logger";

const client = new DynamoDBClient({ region: "eu-west-2" });
const ddbDocClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.TABLE_NAME;

if (!tableName) {
  throw new EnvironmentVariableError("TABLE_NAME");
}

// Helper method to calculate item prefix sums based on probabilities
const calculateItemPrefixSums = (items: CaseItem[]): number[] => {
  const prefixSums: number[] = [];
  let sum = 0;
  const maxRange = 99999;

  items.forEach((item) => {
    sum += item.probability * maxRange;
    prefixSums.push(Math.floor(sum));
  });

  return prefixSums;
};

// Method to add a new case
export const addCase = async (
  caseName: string,
  casePrice: number,
  caseType: CaseType,
  imageUrl: string,
  items: CaseItem[],
  itemPrefixSums: Array<number>
): Promise<void> => {
  const caseId = randomUUID();
  const caseHash = randomUUID();

  const newCase: Case = {
    caseType: caseType,
    caseName: caseName,
    casePrice: casePrice,
    caseId: caseId,
    image_url: imageUrl,
    caseHash: caseHash,
    items: items,
    item_prefix_sums: itemPrefixSums,
  };

  const params = {
    TableName: tableName,
    Item: newCase,
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
    logger.info(`Successfully added case with caseId: ${caseId}`); // Debug logging
  } catch (error) {
    logger.error(`Failed to add case with caseId: ${caseId}: ${error.message}`);
  }
};

// Method to retrieve a case by ID
export const getCase = async (caseId: string): Promise<Case> => {
  const params = {
    TableName: tableName,
    Key: {
      caseId: caseId,
    },
  };

  try {
    const result = await ddbDocClient.send(new GetCommand(params));

    if (!result.Item || Object.keys(result.Item).length === 0) {
      throw new CaseDoesNotExistError(caseId);
    }

    return result.Item as Case;
  } catch (error) {
    logger.error(`Failed to get case with caseId: ${caseId} error: ${error.message}`);
    if (error instanceof CaseDoesNotExistError) {
      throw error;
    } else {
      throw new Error("Failed to get case");
    }
  }
};

// Method to list all cases (overview)
export const listCases = async (): Promise<CaseOverview[]> => {
  const params = {
    TableName: tableName,
  };

  try {
    const result = await ddbDocClient.send(new ScanCommand(params));
    return result.Items as CaseOverview[];
  } catch (error) {
    logger.error("Error fetching cases:", error.message);
    throw new FetchCasesError(error as string);
  }
};

// Method to initialize database with mock data
export const initializeDatabase = async (): Promise<void> => {
  try {
    await addCase(
      mockCase.caseName,
      mockCase.casePrice,
      mockCase.caseType,
      mockCase.image_url,
      mockCase.items,
      mockCase.item_prefix_sums
    );
    logger.info("Database initialized with mock data");
  } catch (error) {
    console.error("Error initializing database with mock data:", error);
  }
};
