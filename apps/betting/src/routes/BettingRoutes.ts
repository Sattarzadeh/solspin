import express from 'express';
import BettingController from '../controllers/BettingController';

const router = express.Router();
const baseUrl = 'http://localhost:3000/wallets';

const bettingController = new BettingController();

router.post('/record/:userId', bettingController.recordBetController);
router.get('/:userId', bettingController.getBetsController);

export default router;
