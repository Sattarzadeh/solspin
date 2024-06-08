import { CaseItem } from "../models/case_item_model";
import { Case } from "../models/case_model";

const findItem = (rollNumber: number, prefixSums: Array<number>): number => {
  let leftPointer = 0;
  let rightPointer = prefixSums.length - 1;

  while (leftPointer < rightPointer) {
    const middlePointer = Math.floor(leftPointer + (rightPointer - leftPointer) / 2);

    if (rollNumber > prefixSums[middlePointer]) {
      leftPointer = middlePointer + 1;
    } else {
      rightPointer = middlePointer;
    }
  }

  return leftPointer;
};

export const determineItem = (rollNumber: number, caseModel: Case): CaseItem => {
  const caseItemPrefixSums = caseModel.item_prefix_sums;
  const itemIndex = findItem(rollNumber, caseItemPrefixSums);
  const rewardItem = caseModel.items[itemIndex];

  return rewardItem;
};

export const generateRollValue = (serverSeed, clientSeed) =>  {

    // const randomSeed = parseInt(combinedSeed, 16);
    // const rng = crypto.createHash('sha256').update(randomSeed.toString()).digest();
    // return parseInt(rng.toString('hex'), 16) % 99999 + 1;
    return 100
}