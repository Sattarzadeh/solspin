
import * as AWS from 'aws-sdk';

const lambda = new AWS.Lambda();

export const callGetBalance = async (userId: string) => {
    const params = {
      FunctionName: 'getBalance',
      Payload: JSON.stringify({ userId }),
    };
  
    try {
      const response = await lambda.invoke(params).promise();
      const payload = JSON.parse(response.Payload as string);
      return payload;
    } catch (error) {
      console.error('Error invoking getBalance Lambda function:', error);
      throw new Error('Error invoking getBalance Lambda function');
    }
};