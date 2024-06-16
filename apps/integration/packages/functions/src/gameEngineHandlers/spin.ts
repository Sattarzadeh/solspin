import { ApiHandler } from "sst/node/api";
import { getCase } from "../../../../../game-engine/src/repository/caseRepository";
import { handleSpin } from "../../../../../game-engine/src/handlers/caseOpeningHandler";
export const handler = ApiHandler(async (event) => {
  console.log(event.body);
  let parsedBody;

  try {
    parsedBody = JSON.parse(event.body);
    console.log("Parsed body:", parsedBody);
  } catch (parseError) {
    console.error("Failed to parse body:", parseError);
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid JSON format",
        error: parseError.message,
      }),
    };
  }

  const { caseId, serverSeed, clientSeed } = parsedBody;

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
