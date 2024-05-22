import { NextFunction, Request, Response, Router } from 'express';
import { CaseOpeningService } from '../services/case_opening_service';
import { CaseDataService } from '../services/case_data_service';
import { validateCaseName } from '../middlewares/validateCaseName';
import { CaseDoesNotExistError } from '../errors/CaseDoesNotExistError';
import { CustomError } from '../errors/CustomError';

class CaseController {
  public router = Router();
  private caseOpeningService: CaseOpeningService;
  private caseDataService: CaseDataService;

  constructor() {
    this.caseOpeningService = new CaseOpeningService();
    this.caseDataService = new CaseDataService();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.getAllCases);
    this.router.get('/:caseName', validateCaseName, this.getCaseByName);
    this.router.post('/:caseName/demospin', validateCaseName, this.demoSpinCase);
  }

  private getCaseByName = async (req: Request, res: Response, next: NextFunction) => {
    const { caseName } = req.params;

    try {
      const data = await this.caseDataService.getCase(caseName);
      res.status(200).json(data);
    } catch (error) {
      next(error); // Pass any error to error handling middleware
    }
  };

  private getAllCases = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.caseDataService.getAllCases();
      res.status(200).json(data);
    } catch (error) {
      next(error); // Pass any error to error handling middleware
    }
  };

  private demoSpinCase = async (req: Request, res: Response, next: NextFunction) => {
    const { caseName } = req.params;

    try {
      const result = await this.caseOpeningService.demoSpin(caseName);
      res.status(200).json(result);
    } catch (error) {
      next(error); // Pass any error to error handling middleware
    }
  };
}

export const caseController = new CaseController().router;
