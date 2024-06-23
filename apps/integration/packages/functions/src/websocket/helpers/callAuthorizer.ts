import * as AWS from "aws-sdk";
import logger from "@solspin/logger";
const lambda = new AWS.Lambda();

export const callAuthorizer = async (token: string) => {
  const params = {
    FunctionName: process.env.AUTHORIZER_FUNCTION_NAME,
    Payload: JSON.stringify({
      queryStringParameters: {
        token,
      },
    }),
  };

  try {
    const response = await lambda.invoke(params).promise();
    const payload = JSON.parse(response.Payload as string);
    return payload;
  } catch (error) {
    logger.error("Error invoking authorizer Lambda function:", error);
    throw new Error("Error invoking authorizer Lambda function");
  }
};
