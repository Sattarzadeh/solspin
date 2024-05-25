import express from 'express';
import { WalletController } from '../controllers/WalletController';
import { validateUserAndWallet } from '../middleware/WalletMiddleware';

const router = express.Router();
const walletController = new WalletController();
router.post(
  '/deposit/:userId',
  validateUserAndWallet(true),
  walletController.deposit
);
router.post(
  '/withdraw/:userId',
  validateUserAndWallet(false),
  walletController.withdraw
);
// Probably add a middleware to check if request maker (should be internal service) is authorised.
router.get('/:userId', walletController.getWallets);
router.get('/balance/:userId', walletController.balance);

// Probably add a middleware to check if request maker (should be internal service) is authorised.
router.post('/create/:userId', walletController.createWallet);

export default router;
