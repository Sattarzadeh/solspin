import { Case } from "@solspin/game-engine-types";
import * as AWS from "aws-sdk";

const lambda = new AWS.Lambda();

export const performSpin = async (caseModel: Case, clientSeed: string, serverSeed: string) => {
  const params = {
    FunctionName: process.env.PERFORM_SPIN_FUNCTION_NAME,
    Payload: JSON.stringify({
      body: JSON.stringify({
        caseModel,
        clientSeed,
        serverSeed,
      }),
    }),
  };

  try {
    const response = await lambda.invoke(params).promise();
    const payload = JSON.parse(response.Payload as string);
    return payload;
  } catch (error) {
    console.error("Error invoking perform spin Lambda function:", error);
    throw new Error("Error invoking perform spin Lambda function");
  }
};
