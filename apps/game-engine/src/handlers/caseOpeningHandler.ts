import { generateRollValue, determineItem } from "../services/caseItemDeterminationService";
import { Case, CaseItem } from "@solspin/game-engine-types";

export const handleSpin = async (
  caseModel: Case,
  serverSeed: string,
  clientSeed: string
): Promise<CaseItem | null> => {
  if (!caseModel || !serverSeed || !clientSeed) {
    throw new Error("caseId, serverSeed, or clientSeed is missing");
  }

  try {
    const rewardItem = performSpin(caseModel, serverSeed, clientSeed);

    return rewardItem;
  } catch (error) {
    console.error("Error in spin:", error);
    throw new Error("Internal Server Error");
  }
};

const performSpin = (caseModel: Case, serverSeed: string, clientSeed: string): CaseItem => {
  const rollValue = generateRollValue(serverSeed, clientSeed);
  console.log("Roll value is: ", rollValue);
  const rewardItem = determineItem(rollValue, caseModel);
  return rewardItem;
};
