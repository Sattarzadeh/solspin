import { CaseItem } from "../models/case_item_model";
import { CaseItemDeterminationService } from "./case_item_determination_service";
import { CaseRollValueGenerator } from "./case_roll_value_generator";
import { mockCase } from "../mock/case.mock";
export class CaseOpeningService {
    private caseItemDeterminationService: CaseItemDeterminationService;
    private caseRollValueGeneratorService: CaseRollValueGenerator;
    constructor() {
        this.caseItemDeterminationService = new CaseItemDeterminationService();
        this.caseRollValueGeneratorService = new CaseRollValueGenerator();
    }
    public demoSpin(caseName: string): CaseItem  {
        /* 
            No checks needed since it's a demospin, perform the work.
        */
        const rewardItem: CaseItem = this.performSpin(caseName)
        return rewardItem
    }

    public normalSpin(caseName: string, token: string): CaseItem {
        /* Perform checks to see if: 
            - user exists,
            - user has enough money,

            if any fail, return error depending on what check failed (need custom errors for this e.g UserDoesNotExistError, UserBalanceLowerThanPriceError)
        */
       return
    }

    private performSpin(caseName: string): CaseItem {
        /*
            Generate new server seed here for now. In the future, the server seed will have to already be generated when the page is loaded up to prove fairness. 
            Checks will have to be done to ensure that the server seed matches the passed in server seed to ensure no tampering has been done.
        */

        const rollValue: number = this.caseRollValueGeneratorService.generateRollValue();
        console.log(rollValue)
        const rewardItem: CaseItem = this.caseItemDeterminationService.determineItem(rollValue, mockCase);
        return rewardItem;
    }
}

