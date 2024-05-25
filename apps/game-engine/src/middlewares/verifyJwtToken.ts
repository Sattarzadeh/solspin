import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export async function verifyJwtToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(401).json({'message': 'User is not logged in'})

    try {
        // const response = await axios.post('endpoint/verify')
        // const { isValid, decoded } = response.data;

        const isValid = true;

        if (!isValid) return res.status(401).json({'message': 'Invalid token sent'})    

        next()

    } catch (error){
        next(new Error());
  }


}
