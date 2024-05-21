import express from 'express';
import { json } from 'body-parser';
import { caseController } from './controllers/case.controller';
import { pageNotFound } from './middlewares/pageNotFound';
import { errorHandler } from './middlewares/errorHandler';
const app = express();
const port = process.env.PORT || 3000;

app.use(json());
app.use('/api/cases', caseController);
app.use(pageNotFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
