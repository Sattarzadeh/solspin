import * as AWS from "aws-sdk";
const lambda = new AWS.Lambda();

export const getUserFromWebSocket = async (connectionId: string) => {
  const params = {
    FunctionName: process.env.GET_USER_FROM_WEBSOCKET_FUNCTION_NAME || "cases",
    Payload: JSON.stringify({
      queryStringParameters: {
        connectionId,
      },
    }),
  };

  const response = await lambda.invoke(params).promise();
  const payload = JSON.parse(response.Payload as string);
  return payload;
};
