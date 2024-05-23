import { NextFunction, Request, Response, Router } from 'express';
import { UserDbService } from '../services/userDbService';
import { User } from '../models/users'
import { randomUUID } from 'crypto';

class UserManagementController {
    public router = Router();
    private userDbService: UserDbService;

    constructor() {
        this.userDbService = new UserDbService();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/update', this.updateUserData.bind(this));
        this.router.post('/create', this.createUserDocument.bind(this));

    }

    private async updateUserData(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const {conditions, updateFields} = req.body;
        
        if (!conditions || !updateFields) return res.status(400).json({"message": "Some data was not included in the request..."})

        try {
            await this.userDbService.updateUserData(conditions, updateFields)
            res.status(201).json({"message": "User data successfully updated"})
        } catch(error) { // change this to DatabaseError error
            return res.status(500).json({"error": error.message})
        }

        return 
    }

    private async createUserDocument(req: Request, res: Response, next: NextFunction): Promise<Response> {

        let { userData } = req.body;
        
        if (!userData || !userData.walletAddress) return res.status(400).json({"message": "Some data was not included in the request..."})
        
        

    
        try {
            let userSchema: User;
            
            await this.userDbService.createUser(userData);
            return res.status(201).json({ message: "User data successfully updated" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
      }

}

export const userManagementController = new UserManagementController().router;
