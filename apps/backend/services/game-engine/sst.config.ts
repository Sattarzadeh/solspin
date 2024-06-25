import type { SSTConfig } from "sst";
import { GameEngineHandlerAPI } from "./stacks/GameEngineStack";

export default {
  config() {
    return {
      name: "game-engine",
      stage: "dev",
      region: "eu-west-2",
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      runtime: "nodejs18.x",
      architecture: "arm_64",
    });

    app.stack(GameEngineHandlerAPI);
  },
} satisfies SSTConfig;
