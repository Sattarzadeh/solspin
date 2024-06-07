import { SSTConfig } from "sst";
import { VPC } from "./stacks/vpc";
import { Event } from "./stacks/EventBus"

export default {
  config(_input) {
    return {
      name: "base-infrastructure",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      runtime: "nodejs18.x",
      architecture: "arm_64",
      environment: {
        STAGE: app.stage,
        REGION: app.region,
      },
    });

    app.stack(VPC);
  }
} satisfies SSTConfig;
