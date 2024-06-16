import { ApiHandler } from "sst/node/api";
export const handler = ApiHandler(async (event) => {
  const caseId = event.queryStringParameters?.caseId;

  if (!caseId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "caseName is missing" }),
    };
  }

  try {
    const caseData = await getCase(caseId);
    return {
      statusCode: 200,
      body: JSON.stringify(caseData),
    };
  } catch (error) {
    console.error("Error getting case data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
});
