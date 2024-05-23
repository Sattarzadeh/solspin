import express from 'express';
import { json } from 'body-parser';
import { userTokenController } from './controllers/userTokenController';
import { userManagementController } from './controllers/userManagementController';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = express();
app.use(express.json());
app.use('/api/user/token', userTokenController)
app.use('/api/user/info', userManagementController)


app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
