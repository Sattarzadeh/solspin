import { SSTConfig } from "sst";
import { VPC } from "./stacks/Vpc";
import { Event } from "./stacks/EventBus";
import { TableStack } from "./stacks/Table";
import { api } from "./stacks/Api";
import { Lambdas } from "./stacks/Lambda";

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

    app.stack(VPC);
    app.stack(TableStack);
    app.stack(Event);
    app.stack(api);
    app.stack(Lambdas);
  },
} satisfies SSTConfig;
