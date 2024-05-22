import jwt from 'jsonwebtoken'

export class JwtTokenService {

    public generateToken(publicKey: string): string {
        const secretKey = "awdoakdo2ojaodo2k"
        const jwtToken = jwt.sign({sub: publicKey}, secretKey, {expiresIn: '1h'})
        return jwtToken
    }

}