import { EventHandler } from "sst/node/event-bus";
import { Todo } from "@user-management/core/todo";

export const handler = EventHandler(Todo.Events.Created, async (evt) => {
  console.log("Todo created", evt);
});
