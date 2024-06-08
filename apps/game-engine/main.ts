import express from 'express';
import { json } from 'body-parser';

import { pageNotFound } from './middlewares/pageNotFound';
import { errorHandler } from './middlewares/errorHandler';
const app = express();
const port = process.env.PORT || 3000;

app.use(json());
app.use(pageNotFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
