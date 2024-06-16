import { ApiHandler } from "sst/node/api";
import { getCase } from "../../../../../game-engine/src/repository/caseRepository";
import { handleSpin } from "../../../../../game-engine/src/handlers/caseOpeningHandler";
export const handler = ApiHandler(async (event) => {
  const { caseId, serverSeed, clientSeed } = JSON.parse(event.body);

  if (!caseId || !serverSeed || !clientSeed) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "caseId, serverSeed, or clientSeed is missing",
      }),
    };
  }

  try {
    const caseModel = await getCase(caseId);
    if (!caseModel) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Case not found" }),
      };
    }

    const rewardItem = await handleSpin(caseModel, serverSeed, clientSeed);

    return {
      statusCode: 200,
      body: JSON.stringify(rewardItem),
    };
  } catch (error) {
    console.error("Error in normalSpin:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
});
