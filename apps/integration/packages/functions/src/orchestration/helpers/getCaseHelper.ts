import * as AWS from "aws-sdk";
import logger from "@solspin/logger";
const lambda = new AWS.Lambda();

export const callGetCase = async (caseId: string) => {
  const params = {
    FunctionName: process.env.GET_CASE_FUNCTION_NAME,
    Payload: JSON.stringify({
      queryStringParameters: {
        caseId,
      },
    }),
  };

  try {
    const response = await lambda.invoke(params).promise();
    const payload = JSON.parse(response.Payload as string);
    return payload;
  } catch (error) {
    logger.error("Error invoking getCase Lambda function:", error);
    throw new Error("Error invoking getCase Lambda function");
  }
};
