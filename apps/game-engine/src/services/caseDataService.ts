import { Case } from "../models/case_model";
import { mockCase } from "../mock/case_pot_of_gold.mock";

export const getCase = async (caseName: string): Promise<Case | null> => {
  try {
    return mockCase["case_name"] === caseName ? mockCase : null;
  } catch (error) {
    console.error("Error reading case data:", error);
    throw new Error("Could not read case data");
  }
};

export const getAllCases = async (): Promise<Array<Case>> => {
  try {
    return [mockCase];
  } catch (error) {
    console.error("Error reading all cases:", error);
    throw new Error("Could not read all cases");
  }
};
