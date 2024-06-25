import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { CaseItem, Case, CaseOverview } from "@solspin/game-engine-types";
import { CaseType } from "../foundation/caseType";
import { randomUUID } from "crypto";
import { CaseDoesNotExistError, EnvironmentVariableError, FetchCasesError } from "@solspin/errors"; // Update with actual path
import { mockCase } from "../__mock__/case_pot_of_gold.mock";

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

  await ddbDocClient.send(new PutCommand(params));
};

// Method to retrieve a case by ID
export const getCase = async (caseId: string): Promise<Case> => {
  const params = {
    TableName: tableName,
    Key: {
      caseId: caseId,
    },
  };

  const result = await ddbDocClient.send(new GetCommand(params));

  if (!result.Item || Object.keys(result.Item).length === 0) {
    throw new CaseDoesNotExistError(caseId);
  }

  return result.Item as Case;
};

// Method to list all cases (overview)
export const listCases = async (): Promise<CaseOverview[]> => {
  const params = {
    TableName: tableName,
  };

  const result = await ddbDocClient.send(new ScanCommand(params));
  return result.Items as CaseOverview[];
};

// Method to initialize database with mock data
export const initializeDatabase = async (): Promise<void> => {
  await addCase(
    mockCase.caseName,
    mockCase.casePrice,
    mockCase.caseType,
    mockCase.image_url,
    mockCase.items,
    mockCase.item_prefix_sums
  );
};
