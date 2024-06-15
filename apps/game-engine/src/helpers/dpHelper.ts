import { randomUUID } from "crypto";
import dynamoDB from "../db/dbConnection";
import { PutCommand, QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { CaseItem } from "../models/case_item_model";
import { Case, CaseOverview } from "../models/case_model";
import { CaseType } from "../enums/caseType";
import { mockCase } from "../mock/case_pot_of_gold.mock";

export class DatabaseHandlerService {
  private tableName: string;

  constructor() {
    this.tableName = process.env.AWS_CASE_TABLE_NAME;
  }

  // Method to add a new case
  public addCase = async (
    caseName: string,
    casePrice: number,
    caseType: CaseType,
    imageUrl: string,
    items: CaseItem[]
  ): Promise<void> => {
    const caseId = randomUUID();
    const caseHash = randomUUID();
    const itemPrefixSums = this.calculateItemPrefixSums(items);

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
      TableName: "cases",
      Item: newCase,
    };

    await dynamoDB.send(new PutCommand(params));
  };

  // Method to retrieve a case by ID
  public getCase = async (caseId: string): Promise<Case> => {
    console.log(caseId);
    const params = {
      TableName: "cases",
      Key: {
        caseId: caseId,
      },
    };
    const result = await dynamoDB.send(new GetCommand(params));

    if (!result.Item || result.Item.length === 0) {
      throw new Error("Case was not found");
    }

    return result.Item as Case;
  };

  // Method to list all cases (overview)
  public listCases = async (): Promise<CaseOverview[]> => {
    const params = {
      TableName: this.tableName,
    };

    try {
      const result = await dynamoDB.send(new QueryCommand(params));
      return result.Items as CaseOverview[];
    } catch (error) {
      console.error("Error fetching cases:", error);
      throw new Error("Could not fetch cases");
    }
  };

  // Helper method to calculate item prefix sums
  private calculateItemPrefixSums(items: CaseItem[]): number[] {
    const prefixSums: number[] = [];
    let sum = 0;

    items.forEach((item) => {
      sum += item.probability;
      prefixSums.push(sum);
    });

    return prefixSums;
  }

  public initializeDatabase = async (): Promise<void> => {
    try {
      await this.addCase(
        mockCase.caseName,
        mockCase.casePrice,
        mockCase.caseType,
        mockCase.image_url,
        mockCase.items
      );
      console.log("Database initialized with mock data");
    } catch (error) {
      console.error("Error initializing database with mock data:", error);
    }
  };
}
