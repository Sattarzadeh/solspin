import { SSTConfig } from "sst";
import { Event } from "./stacks/EventBus";

export default {
  config(_input) {
    return {
      name: "base-infrastructure",
      stage: "dev",
      region: "eu-west-2",
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

    // app.stack(VPC);
    app.stack(Event);
  },
} satisfies SSTConfig;
