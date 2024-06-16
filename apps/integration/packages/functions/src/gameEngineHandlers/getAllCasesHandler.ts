import { ApiHandler } from "sst/node/api";
export const handler = ApiHandler(async (event) => {
  try {
    const cases = await getAllCases();
    return {
      statusCode: 200,
      body: JSON.stringify(cases),
    };
  } catch (error) {
    console.error("Error getting all cases:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
});
