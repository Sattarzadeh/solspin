import { SSTConfig } from "sst";
import { WebSocketHandlerAPI } from "./stacks/WebSocketHandlerStack";
import { GameEngineHandlerAPI } from "./stacks/GameEngineStack";
export default {
  config(_input) {
    return {
      name: "integration",
      region: "eu-west-2",
    };
  },
  stacks(app) {
    app.stack(WebSocketHandlerAPI).stack(GameEngineHandlerAPI);
  },
} satisfies SSTConfig;
