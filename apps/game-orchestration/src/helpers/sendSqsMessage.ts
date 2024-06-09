import * as AWS from 'aws-sdk';
const sqs = new AWS.SQS();

export const sendMessageToSQS = async (queueUrl: string, messageBody: object) => {
    const params = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(messageBody),
    };
  
    try {
      const response = await sqs.sendMessage(params).promise();
      return response;
    } catch (error) {
      console.error('Error sending message to SQS:', error);
      throw new Error('Error sending message to SQS');
    }
  };