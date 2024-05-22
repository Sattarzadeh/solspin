import express from 'express';
import { json } from 'body-parser';
import { userController } from './controllers/userController';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = express();
app.use(express.json());
app.use('/api/user', userController)



app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
