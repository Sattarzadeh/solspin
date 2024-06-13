import { NextFunction, Request, Response, Router } from 'express';
import { JwtTokenService } from '../services/jwtTokenService';

class UserTokenController {
    public router = Router();
    private jwtTokenService: JwtTokenService;

    constructor() {
        this.jwtTokenService = new JwtTokenService();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/generate', this.createJWTToken.bind(this));
        this.router.post('/verify', this.verifyJWTToken.bind(this));
    }

    private async createJWTToken(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const { publicKey } = req.body;
        if (!publicKey) return res.status(400).json({ "message": "There was an invalid public key sent" });

        const jwtToken = await this.jwtTokenService.generateToken(publicKey);
        return res.status(201).json({ "token": jwtToken });
    }

    private async verifyJWTToken(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const { token } = req.body;
        if (!token) return res.status(400).json({ "message": "Token is required" });

        try {
            const decoded = await this.jwtTokenService.verifyToken(token);
            return res.status(200).json({ "decoded": decoded });
        } catch (error) {
            return res.status(401).json({ "message": "Invalid token" });
        }
    }
}

export const userTokenController = new UserTokenController().router;
