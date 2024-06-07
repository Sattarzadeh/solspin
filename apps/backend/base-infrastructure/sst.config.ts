import { SSTConfig } from "sst";
import { API } from "./stacks/MyStack";
import { VPC } from "./stacks/Vpc";
export default {
  config(_input) {
    return {
      name: "base-infrastructure",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      runtime:'nodejs18.x',
      architecture:'arm_64',
      environment: {
        STAGE: app.stage,
        REGION: app.region,
      },
    });

    app.stack(VPC);
    // app.stack(Event);
  },
} satisfies SSTConfig;
