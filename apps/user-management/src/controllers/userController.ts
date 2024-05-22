import { NextFunction, Request, Response, Router } from 'express';
import { JwtTokenService } from '../services/jwtTokenService';

class UserController {
    public router = Router();
    private jwtTokenService: JwtTokenService;

    constructor() {
        this.jwtTokenService = new JwtTokenService();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/generate-token', this.createJWTToken.bind(this));
        this.router.post('/verify-token', this.verifyJWTToken.bind(this));
    }

    private async createJWTToken(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const { publicKey } = req.body;
        if (!publicKey) return res.status(400).json({ "message": "There was an invalid public key sent" });

        const jwtToken = await this.jwtTokenService.generateToken(publicKey);
        return res.status(201).json({ "token": jwtToken });
    }

    private async verifyJWTToken(req: Request, res: Response, next: NextFunction): Promise<Response> {
        return res.status(200).json({ "message": "Token verification endpoint" });
    }
}

export const userController = new UserController().router;
