import { CaseItem } from '../models/case_item_model';
import { Case } from '../models/case_model';
import { createHmac } from 'crypto';
const findItem = (rollNumber: number, prefixSums: Array<number>): number => {
  let leftPointer = 0;
  let rightPointer = prefixSums.length - 1;

  while (leftPointer < rightPointer) {
    const middlePointer = Math.floor(
      leftPointer + (rightPointer - leftPointer) / 2
    );

    if (rollNumber > prefixSums[middlePointer]) {
      leftPointer = middlePointer + 1;
    } else {
      rightPointer = middlePointer;
    }
  }

  return leftPointer;
};

export const determineItem = (
  rollNumber: number,
  caseModel: Case
): CaseItem => {
  const caseItemPrefixSums = caseModel.item_prefix_sums;
  const itemIndex = findItem(rollNumber, caseItemPrefixSums);
  const rewardItem = caseModel.items[itemIndex];

  return rewardItem;
};

const MAX_HEX_SEGMENTS = 6;
const HEX_SEGMENT_SIZE = 2;
const BASE_FOR_HEX_CONVERSION = 256;
const HASH_TYPE = 'sha256';
const TICKET_QUANTITY = 99999;

function calculateDecimalValue(preResult: string): number {
  let decimalValue = 0;
  for (let i = 0; i < MAX_HEX_SEGMENTS; i++) {
    const hexValue = preResult.substr(HEX_SEGMENT_SIZE * i, HEX_SEGMENT_SIZE);
    decimalValue +=
      parseInt(hexValue, 16) / Math.pow(BASE_FOR_HEX_CONVERSION, i + 1);
  }
  return decimalValue;
}

function getProvablyFairResult(
  init: string,
  serverSeed: string,
  qty: number
): { preResult: string; result: number } {
  const preResult = createHmac(HASH_TYPE, serverSeed)
    .update(init)
    .digest('hex');
  const decimalValue = calculateDecimalValue(preResult);
  const result = Math.floor(decimalValue * qty) + 1;
  return {
    preResult: preResult,
    result: result,
  };
}

export const generateRollValue = (
  serverSeed: string,
  clientSeed: string,
  nonce: number
): number => {
  if (!serverSeed || !clientSeed || nonce < 0) {
    throw new Error('Invalid inputs');
  }

  const sanitizedServerSeed = serverSeed.replace(/\r|\n/g, '');
  const sanitizedClientSeed = clientSeed.replace(/\r|\n/g, '');
  const nrand = sanitizedClientSeed.length;
  const stringToHash = `${sanitizedClientSeed}-${nrand}-${nonce}`;

  const { result } = getProvablyFairResult(
    stringToHash,
    sanitizedServerSeed,
    TICKET_QUANTITY
  );
  return result;
};
