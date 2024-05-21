import { Request, Response, Router } from 'express';
import { CaseOpeningService } from '../services/case_opening_service';
import { CaseDataService } from '../services/case_data_service';
import { validateCaseName } from '../middlewares/validateCaseName';
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
        // this.router.get('/', this.getAllCases);
        this.router.get('/:caseName', validateCaseName, this.getCaseByName);
        this.router.post('/:caseName/demospin', validateCaseName, this.demoSpinCase);
    }

    private getCaseByName = async (req: Request, res: Response) => {
        const { caseName } = req.params;

        const data = await this.caseDataService.getCase(caseName);
        if (data) {
            res.status(200).json(data)
        } else {
            res.status(404).json({message: "Case not found"})
        }

    };

    // private getAllCases = async (req: Request, res: Response) => {
    //     try {
    //         const data = await this.caseDataService.getAllCases();
    //         res.status(200).json(data)
    //     } catch {
    //         res.status(500).json({message: "Something went wrong..."})
    //     }
        

    // };

    private demoSpinCase = async (req: Request, res: Response) => {
        const { caseName } = req.params;

        try {
            const result = await this.caseOpeningService.demoSpin(caseName);
            console.log(result)
            res.status(200).json(result)
        } catch {
            res.status(500).json({message: "Something went wrong..."})
        }
    
    };
}

export const caseController = new CaseController().router;
