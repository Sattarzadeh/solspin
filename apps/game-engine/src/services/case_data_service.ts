import { Case } from "../models/case_model";
import { mockCase } from "../mock/case_pot_of_gold.mock";


export class CaseDataService {


    public async getCase(caseName: string): Promise<Case | null> {
        try {
        return mockCase["case_name"] == caseName ? mockCase : null;
        } catch (error) {
        console.error("Error reading case data:", error);
        throw new Error("Could not read case data");
        }
    }

    public async getAllCases(): Promise<Array<Case>> {
        try {
        const caseData = await mockCase;
        return Object.values(caseData);
        } catch (error) {
        console.error("Error reading all cases:", error);
        throw new Error("Could not read all cases");
        }
    }
}
