import { StackContext, Api, EventBus, Table } from 'sst/constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

export function API({ stack }: StackContext) {
  // Create a VPC for the Lambda functions
  // const vpc = new ec2.Vpc(stack, 'MyVpc', {
  //   maxAzs: 2, // Default is all AZs in the region
  // });

  // // Create a security group for the Lambda functions
  // const securityGroup = new ec2.SecurityGroup(stack, 'CommonSecurityGroup', {
  //   vpc,
  //   allowAllOutbound: true, // Allow all outbound traffic
  // });

  // securityGroup.addIngressRule(
  //   ec2.Peer.ipv4(vpc.vpcCidrBlock),
  //   ec2.Port.allTraffic(),
  //   'Allow all inbound traffic within the VPC'
  // );

  // // Create EventBus
  // const bus = new EventBus(stack, 'bus', {
  //   defaults: {
  //     retries: 10,
  //   },
  // });

  // Create DynamoDB Table
  const sessionsTable = new Table(stack, 'Sessions', {
    fields: {
      sessionId: 'string',
      userId: 'string',
      createdAt: 'string',
      serverSeed: 'string',
      expiresAt: 'number',
    },
    primaryIndex: { partitionKey: 'sessionId' },
    timeToLiveAttribute: 'expireAt',
  });

  const userTable = new Table(stack, 'Users', {
    fields: {
      userId: 'string',
      createdAt: 'string',
      updatedAt: 'string',
      discordName: 'string',
      username: 'string',
    },
    primaryIndex: { partitionKey: 'userId' },
  });
  // Create API and configure Lambda functions
  const api = new Api(stack, 'api', {
    defaults: {
      function: {
        bind: [sessionsTable, userTable],
      },
    },
    routes: {
      'POST /api/generate-seed':
        'packages/functions/src/handlers/generateServerSeed.handler',
      'POST /api/session':
        'packages/functions/src/handlers/createSession.handler',
      'GET /api/session': 'packages/functions/src/handlers/getSession.handler',
      'DELETE /api/session': 'packages/functions/src/deleteSession.handler',
      'POST /api/user': 'packages/functions/src/createUser.handler',
      'PATCH /api/user': 'packages/functions/src/updateUser.handler',
      'DELETE /api/user': 'packages/functions/src/deleteUser.handler',
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
