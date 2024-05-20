import {CaseItem} from "../models/case_item_model"
import { Case } from "../models/case_model";
class CaseItemDeterminationService {

    private findItem(rollNumber: number, prefixSums: Array<number>): number {
        let leftPointer: number = 0;
        let rightPointer: number = prefixSums.length - 1;

        while (leftPointer < rightPointer) {
            const middlePointer = Math.floor(leftPointer + (rightPointer - leftPointer) / 2);

            if (rollNumber > prefixSums[middlePointer]) {
                leftPointer = middlePointer + 1;
            } else {
                rightPointer = middlePointer;
            }
        }

        return leftPointer;
    }

    public determineItem(rollNumber: number, case_model: Case): CaseItem { 
        
        const caseItemPrefixSums: Array<number> = case_model.item_prefix_sums;
        const item_index: number = this.findItem(rollNumber, caseItemPrefixSums);
        const reward_item: CaseItem = case_model.items[item_index];
        

        return reward_item
    }
   


}   