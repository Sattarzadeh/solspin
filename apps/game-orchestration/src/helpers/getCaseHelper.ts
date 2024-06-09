import * as AWS from 'aws-sdk';

const lambda = new AWS.Lambda();

export const callGetCase = async (caseId: string) => {
  const params = {
    FunctionName: 'getCaseHandler', // Replace with your Lambda function name
    Payload: JSON.stringify({ body: JSON.stringify({ caseId }) }),
  };

  try {
    const response = await lambda.invoke(params).promise();
    const payload = JSON.parse(response.Payload as string);
    return payload;
  } catch (error) {
    console.error('Error invoking getCase Lambda function:', error);
    throw new Error('Error invoking getCase Lambda function');
  }
};
