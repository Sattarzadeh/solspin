import * as cdk from 'aws-cdk-lib';
import { StackContext, EventBus, EventBusRuleProps } from 'sst/constructs';

/**
 * Event Bus Stack
 *
 * This stack creates an Amazon EventBridge event bus, which acts as a central hub for
 * sending and receiving events in our application.
 *
 * An event bus is like a message board where different parts of our application can post
 * messages (events) and other parts can listen for and react to those messages. It helps
 * decouple different components of our application and enables event-driven architectures.
 *
 * @param {Object} props - The stack context props
 * @param {StackContext} props.stack - The SST stack context
 */
export function Event({ stack }: StackContext) {
  const eventBus = new EventBus(stack, 'EventBus', {
    rules: {
      ProcessBetRule: {
        pattern: { source: ['processBet'] },
        targets: {
          myTarget1: 'src/processBet.handler',
        },
      },
      UpdateBalanceRule: {
        pattern: { source: ['updateBalance'] },
        targets: {
          myTarget1: 'src/updateBalance.handler',
        },
      },
    },
  });

  new cdk.CfnOutput(stack, 'EventBusArn', {
    value: eventBus.eventBusArn,
    exportName: `EventBusArn--${process.env.STAGE}`,
  });

  return {
    eventBusName: eventBus.eventBusName,
    eventBusArn: eventBus.eventBusArn,
  };
}
