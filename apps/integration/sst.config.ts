import { SSTConfig } from "sst";
import { API } from "./stacks/WebSocketHandlerStack";

export default {
  config(_input) {
    return {
      name: "integration",
      region: "eu-west-2",
    };
  },
  stacks(app) {
    app.stack(API);
  },
} satisfies SSTConfig;
