import { Case } from "../models/case_model";

export class CaseDataService {

    public getCase(caseName: string): Case {
        /*
            Access datastore (or cache) which should be indexed by caseName for efficiency and check if the caseName exists, 
            if it does return the case object if not throw error
        */
        return
    }

    public getAllCases(): Array<Case> {
        /*
            Access datastore return all cases (pagination)
        */

        return
    }

}