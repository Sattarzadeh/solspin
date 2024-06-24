import { SSTConfig } from "sst";
import { WebSocketHandlerAPI } from "./stacks/WebSocketHandlerStack";
import { GameEngineHandlerAPI } from "./stacks/GameEngineStack";
import { WebSocketGateway } from "./stacks/WebSocketGatewayStack";
import { UserManagementHandlerAPI } from "./stacks/UserManagementStack";
export default {
  config(_input) {
    return {
      name: "integration",
      region: "eu-west-2",
      dev: {
        port: 3002,
      },
    };
  },
  stacks(app) {
    app
      .stack(UserManagementHandlerAPI)
      .stack(WebSocketHandlerAPI)
      .stack(GameEngineHandlerAPI)
      .stack(WebSocketGateway);
  },
} satisfies SSTConfig;
