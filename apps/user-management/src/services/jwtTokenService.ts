import jwt from 'jsonwebtoken'

export class JwtTokenService {

    private secretKey: string;

    constructor() {
        this.secretKey = "awdoakdo2ojaodo2k" // change to aws secrets manager
    }
    public generateToken(publicKey: string): string {

        const jwtToken = jwt.sign({sub: publicKey}, this.secretKey, {expiresIn: '1h'})
        return jwtToken
    }
    
    public verifyToken(jwtToken: string): string {

        return jwt.verify(jwtToken, this.secretKey)
    }

}