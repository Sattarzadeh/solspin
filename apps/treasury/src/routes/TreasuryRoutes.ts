import express from 'express';
import { TreasuryController } from '../controllers/TreasuryController';

const router = express.Router();
const treasuryController = new TreasuryController();
router.post('/deposit/:userId', treasuryController.deposit);
router.post('/withdraw/:userId', treasuryController.withdraw);

export default router;
