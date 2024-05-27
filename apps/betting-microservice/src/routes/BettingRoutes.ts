import express from 'express';
import BettingController from '../controllers/BettingController';
import { BettingService } from '../services/BettingService';
import { DatabaseHandlerService } from '../services/DatabaseHandlerService';
import { RemoteService } from '../services/RemoteService';

const router = express.Router();
const baseUrl = 'http://localhost:3000/wallets';
const remoteService = new RemoteService(baseUrl);
const databaseHandlerService = new DatabaseHandlerService();
const bettingService = new BettingService(
  remoteService,
  databaseHandlerService
);
const bettingController = new BettingController(bettingService);

router.post('/record/:userId', bettingController.recordBet);
router.get('/:userId', bettingController.getBets);

export default router;
