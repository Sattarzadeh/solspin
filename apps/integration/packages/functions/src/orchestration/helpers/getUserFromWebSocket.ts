import * as AWS from "aws-sdk";

const lambda = new AWS.Lambda();

export const getUserFromWebSocket = async (sid: string) => {
  const params = {
    FunctionName: process.env.GET_USER_FROM_WEBSOCKET_FUNCTION_NAME,
    Payload: JSON.stringify({
      queryStringParameters: {
        sid,
      },
    }),
  };

  try {
    const response = await lambda.invoke(params).promise();
    const payload = JSON.parse(response.Payload as string);
    return payload;
  } catch (error) {
    console.error("Error invoking getCase Lambda function:", error);
    throw new Error("Error invoking getCase Lambda function");
  }
};
