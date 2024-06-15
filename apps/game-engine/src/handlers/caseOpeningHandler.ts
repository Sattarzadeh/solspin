import { APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from "aws-sdk";
import { generateRollValue, determineItem } from "../services/caseItemDeterminationService";
import { CaseItem } from "../models/case_item_model";
import { Case } from "../models/case_model";

const lambda = new AWS.Lambda();

export const normalSpinHandler: APIGatewayProxyHandler = async (event) => {
  const { caseId, serverSeed, clientSeed } = JSON.parse(event.body);

  if (!caseId || !serverSeed || !clientSeed) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "caseId, serverSeed, or clientSeed is missing",
      }),
    };
  }

  try {
    const caseModel = await getCaseModel(caseId);
    if (!caseModel) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Case not found" }),
      };
    }

    const rewardItem = performSpin(caseModel, serverSeed, clientSeed);
    // increment the nonce and then update the db with the usermanagement microservice
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
};

const getCaseModel = async (caseId: string): Promise<Case | null> => {
  const params = {
    FunctionName: "caseDataHandler",
    Payload: JSON.stringify({ caseId }),
  };

  try {
    const response = await lambda.invoke(params).promise();
    const payload = JSON.parse(response.Payload as string);

    if (payload.statusCode === 200) {
      return JSON.parse(payload.body);
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error invoking caseDataHandler Lambda function:", error);
    throw new Error("Error invoking caseDataHandler Lambda function");
  }
};

const performSpin = (caseModel: Case, serverSeed: string, clientSeed: string): CaseItem => {
  const rollValue = generateRollValue(serverSeed, clientSeed);
  const rewardItem = determineItem(rollValue, caseModel);
  return rewardItem;
};
