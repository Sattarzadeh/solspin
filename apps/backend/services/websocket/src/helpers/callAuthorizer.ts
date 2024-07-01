import * as AWS from "aws-sdk";

const lambda = new AWS.Lambda();

export const callAuthorizer = async (token: string) => {
  const bearerToken = `Bearer ${token}`;

  const params = {
    FunctionName: process.env.AUTHORIZER_FUNCTION_NAME,
    Payload: JSON.stringify({
      headers: {
        Authorization: bearerToken,
      },
    }),
  };

  const response = await lambda.invoke(params).promise();
  const payload = JSON.parse(response.Payload as string);
  return payload;
};
