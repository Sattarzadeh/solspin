import type { SSTConfig } from "sst";
import { MyStack } from "./stacks/MyStack";

export default {
  config() {
    return {
      name: "betting",
      stage: "dev",
      region: "eu-west-2",
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      runtime: "nodejs18.x",
      architecture: "arm_64",
    });

    app.stack(MyStack);
  },
} satisfies SSTConfig;
