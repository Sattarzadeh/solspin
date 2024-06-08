import { Function, StackContext } from 'sst/constructs';

export function Lambdas({ stack }: StackContext) {
  const processBet = new Function(stack, 'ProcessBet', {
    handler: '../packages/functions/src/lambda.handler',
  });

  const updateBalance = new Function(stack, 'UpdateBalance', {
    handler: './../packages/functions/src/lambda.handler',
  });

  return {
    processBetArn: processBet.functionArn,
    updateBalanceArn: updateBalance.functionArn,
  };
}
