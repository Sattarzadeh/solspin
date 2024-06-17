import { Case } from "../game-engine/types";
export interface SpinPayload {
  caseModel: Case;
  serverSeed: string;
  clientSeed: string;
}
