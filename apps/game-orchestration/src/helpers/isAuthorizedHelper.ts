import * as AWS from 'aws-sdk';

const lambda = new AWS.Lambda();

export const callIsAuthorized = async (token: string) => {
    const params = {
      FunctionName: 'isAuthorized', 
      Payload: JSON.stringify({ jwt: token }),
    };
  
    try {
      const response = await lambda.invoke(params).promise();
      const payload = JSON.parse(response.Payload as string);
      return payload;
    } catch (error) {
      console.error('Error invoking isAuthorized Lambda function:', error);
      throw new Error('Error invoking isAuthorized Lambda function');
    }
};