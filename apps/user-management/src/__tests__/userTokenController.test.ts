import request from 'supertest';
import express, { Express } from 'express';
import { userTokenController } from '../controllers/userTokenController';
import { JwtTokenService } from '../services/jwtTokenService';

// Mock JwtTokenService
jest.mock('../services/jwtTokenService');

const MockJwtTokenService = JwtTokenService as jest.MockedClass<typeof JwtTokenService>;

describe('UserTokenController', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/token', userTokenController);
  });

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    MockJwtTokenService.mockClear();
  });

  describe('POST /generate', () => {
    it('should return 400 if publicKey is not provided', async () => {
      const response = await request(app)
        .post('/api/token/generate')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ "message": "There was an invalid public key sent" });
    });

    it('should return 201 and a JWT token if publicKey is provided', async () => {
      const mockToken = 'mockToken';
      MockJwtTokenService.prototype.generateToken.mockResolvedValue(mockToken as never);

      const response = await request(app)
        .post('/api/token/generate')
        .send({ publicKey: 'validPublicKey' });
      
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ "token": mockToken });
    });
  });

  describe('POST /verify', () => {
    it('should return 400 if token is not provided', async () => {
      const response = await request(app)
        .post('/api/token/verify')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ "message": "Token is required" });
    });

    it('should return 200 and decoded token if token is valid', async () => {
      const mockDecoded = { sub: 'validPublicKey' };
      MockJwtTokenService.prototype.verifyToken.mockResolvedValue(mockDecoded as never);

      const response = await request(app)
        .post('/api/token/verify')
        .send({ token: 'validToken' });
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ "decoded": mockDecoded });
    });

    it('should return 401 if token is invalid', async () => {
      MockJwtTokenService.prototype.verifyToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const response = await request(app)
        .post('/api/token/verify')
        .send({ token: 'invalidToken' });
      
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ "message": "Invalid token" });
    });
  });
});
