import { SSTConfig } from "sst";
import { WebSocketHandlerAPI } from "./stacks/WebSocketHandlerStack";
import { GameEngineHandlerAPI } from "./stacks/GameEngineStack";
import { OrchestrationStack } from "./stacks/OrchestrationStack";
import { WebSocketGateway } from "./stacks/WebSocketGatewayStack";
import { UserManagementHandlerAPI } from "./stacks/UserManagementStack";
export default {
  config(_input) {
    return {
      name: "integration",
      region: "eu-west-2",
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
