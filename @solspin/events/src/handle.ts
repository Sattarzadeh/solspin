import { Context, EventBridgeEvent, SQSEvent } from "aws-lambda";
import { EventBody, EventConfig, EventProvider } from "./types";
import { validateEvent } from "./validate";

export interface EventHandlerConfig<T> {
  eventProvider: EventProvider;
  handler: (
    payload: T,
    config: EventConfig,
    event: EventBridgeEvent<"event", EventBody<T>>,
    context: Context
  ) => Promise<void>;
}

export function handleEvent<T>(
  config: EventHandlerConfig<T>
): (event: SQSEvent, context: Context) => Promise<void> {
  return async (event: SQSEvent, context: Context) => {
    try {
      console.log("Received event:", JSON.stringify(event));

      if (event.Records.length === 0) {
        console.warn("No records found in the SQS event");
        return;
      }

      const promises = event.Records.map(async (record) => {
      const eventBridgeEvent = JSON.parse(record.body) as EventBridgeEvent<"event", EventBody<T>>;
      const { metadata, payload, publisher } = eventBridgeEvent.detail;

      const eventConfig: EventConfig = {
        publisher,
      };

      console.log("Event payload:", JSON.stringify(payload));
      console.log("Event config:", JSON.stringify(eventConfig));

      try {
        console.log("Validating event payload...");
        const validatedPayload = validateEvent(payload, config.eventProvider.schema);

        console.log("Handling event...");
        await config.handler(validatedPayload, eventConfig, eventBridgeEvent, context);

        console.log("Event handling completed successfully");
      } catch (error) {
        console.error("Event handling failed:", error);
          throw error;
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Error processing event records:', error);
      throw error;
    }
  };
}

