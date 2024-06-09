import express from 'express';
import { json } from 'body-parser';

import { pageNotFound } from './middlewares/pageNotFound';
import { errorHandler } from './middlewares/errorHandler';
import { DatabaseHandlerService } from './helpers/dbHelper';
const app = express();
const port = process.env.PORT || 3000;
let db = new DatabaseHandlerService();

db.initializeDatabase()
app.use(json());
app.use(pageNotFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
