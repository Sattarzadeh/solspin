import express from 'express';
import { WalletController } from '../controllers/WalletController';

const router = express.Router();
const walletController = new WalletController();
router.post('/deposit/:userId', walletController.deposit);
router.post('/withdraw/:userId', walletController.withdraw);

router.get('/:userId', walletController.getWallets);
router.get('/balance/:userId', walletController.balance);

router.post('/create/:userId', walletController.createWallet);

router.put('/balance/update/:userId', walletController.updateBalance);
export default router;
