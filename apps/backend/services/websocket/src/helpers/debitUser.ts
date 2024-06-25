import * as AWS from "aws-sdk";

const lambda = new AWS.Lambda();

export const debitUser = async (userId: string, amount: number) => {
  const params = {
    FunctionName: process.env.BET_TRANSACTION_FUNCTION_NAME,
    Payload: JSON.stringify({
      body: JSON.stringify({
        userId,
        amount,
      }),
    }),
  };
  const response = await lambda.invoke(params).promise();
  const payload = JSON.parse(response.Payload as string);
  return payload;
};
