import { v4 as uuidv4 } from "uuid";
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { Service } from "@solspin/types";
import { EventBody, EventProvider } from "./types";
import { validateEvent } from "./validate";
import { getLogger } from "@solspin/logger";

const logger = getLogger("publish-event");
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
  publisher: Service
): Promise<void> {
  const eventBusArn = process.env["EVENT_BUS_ARN"];

  if (!eventBusArn) {
    throw new Error("Event bus name could not be established");
  }

  const requestId = uuidv4();

  validateEvent(payload, event.schema);

  const eventBody: EventBody<T> = {
    publisher,
    metadata: {
      requestId,
    },
    payload,
  };
  logger.info("Publishing event", { event: event.name, payload: eventBody });
  const command = new PutEventsCommand({
    Entries: [
      {
        EventBusName: eventBusArn,
        Source: `${publisher}.${event.name}`,
        DetailType: "event",
        Detail: JSON.stringify(eventBody),
      },
    ],
  });

  await eventBridgeClient.send(command);
}
