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
        const { user_id, updateFields } = req.body;
    

        if (!user_id) {
            return res.status(400).json({ "message": "user_id is required" });
        }
    
        if (!updateFields || typeof updateFields !== 'object' || Object.keys(updateFields).length === 0) {
            return res.status(400).json({ "message": "updateFields must be a non-empty object" });
        }
    
        try {
            await this.userDbService.updateUserData(user_id, updateFields);
            return res.status(200).json({ "message": "User data successfully updated" });
        } catch (error) {
            return res.status(500).json({ "error": error.message });
        }
    }

    private async createUserDocument(req: Request, res: Response, next: NextFunction): Promise<Response> {

        let { walletAddress } = req.body;
 
        if (!walletAddress) return res.status(400).json({"message": "Some data was not included in the request..."})
        
        

    
        try {
            
            await this.userDbService.createUser(walletAddress);
            return res.status(201).json({ message: "User data successfully updated" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
      }

}

export const userManagementController = new UserManagementController().router;
