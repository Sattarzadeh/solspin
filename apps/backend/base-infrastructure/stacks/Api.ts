import { Api, StackContext } from 'sst/constructs';

//TODO - move this

export function api({ stack }: StackContext) {
  // Create a new API
  const api = new Api(stack, 'Api', {
    routes: {
      $default: '../packages/functions/src/lambda.handler',
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
