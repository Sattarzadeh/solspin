import { v4 as uuidv4 } from 'uuid';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { EventBody, EventConfig, EventProvider } from "./types";
import { validateEvent } from './validate';

const eventBridgeClient = new EventBridgeClient({});

/**
 * Publishes an event to the specified event bus.
 * 
 * @param {EventProvider} event - The event provider containing the event name, validation schema, and factory function.
 * @param {T} payload - The payload of the event.
 * @param {EventConfig} config - The configuration object for the event.
 * @returns {Promise<void>}
 */
export async function publishEvent<T>(
  event: EventProvider,
  payload: T,
  config: EventConfig
): Promise<void> {
  const eventBusName = process.env['EVENT_BUS_NAME'];
  
  if (!eventBusName) {
    throw new Error('Event bus name could not be established');
  }

  const requestId = uuidv4();

  validateEvent(payload, event.schema);

  const eventBody: EventBody<T> = {
    publisher: config.publisher,
    metadata: {
      requestId,
    },
    payload,
  };

  const command = new PutEventsCommand({
    Entries: [
      {
        EventBusName: eventBusName,
        Source: `${config.publisher}.${event.name}`,
        DetailType: 'event',
        Detail: JSON.stringify(eventBody),
      },
    ],
  });

  await eventBridgeClient.send(command);
}