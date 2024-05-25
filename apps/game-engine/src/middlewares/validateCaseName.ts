import { Request, Response, NextFunction } from 'express';
import { CaseDataService } from '../services/case_data_service';
import { CaseDoesNotExistError } from '../errors/CaseDoesNotExistError';

const caseDataService = new CaseDataService();

export async function validateCaseName(req: Request, res: Response, next: NextFunction) {
    const { caseName } = req.params;
    try {
        const data = await caseDataService.getCase(caseName)
        if (data) {
            next();
        } else {
            next(new CaseDoesNotExistError(caseName));
        }
    } catch {
        next(new Error());
  }


}
