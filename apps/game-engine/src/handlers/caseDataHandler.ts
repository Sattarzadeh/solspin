import { APIGatewayProxyHandler } from 'aws-lambda';
import { getCase, getAllCases } from '../services/caseDataService';

export const getCaseHandler: APIGatewayProxyHandler = async (event) => {
  const { caseId } = JSON.parse(event.body);

  if (!caseId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'caseName is missing' }),
    };
  }

  try {
    const caseData = await getCase(caseId);
    return {
      statusCode: 200,
      body: JSON.stringify(caseData),
    };
  } catch (error) {
    console.error('Error getting case data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

export const getAllCasesHandler: APIGatewayProxyHandler = async () => {
  try {
    const cases = await getAllCases();
    return {
      statusCode: 200,
      body: JSON.stringify(cases),
    };
  } catch (error) {
    console.error('Error getting all cases:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
