import express from 'express';
import BettingController from '../controllers/BettingController';

const router = express.Router();
const bettingController = new BettingController();
router.post('/record/:userId', bettingController.recordBet);
router.get('/:userId', bettingController.getBets);
export default router;
