import "sst/node/config";
import "sst/node/table";
import "sst/node/api";

declare module "sst/node/config" {
  export interface ConfigTypes {
    APP: string;
    STAGE: string;
  }
}

declare module "sst/node/table" {
  export interface TableResources {
    transactions: {
      tableName: string;
    };
  }
}

declare module "sst/node/api" {
  export interface ApiResources {
    api: {
      url: string;
    };
  }
}
