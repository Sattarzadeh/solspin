import express from 'express';
import { json } from 'body-parser';
import { caseController } from './controllers/case.controller';

const app = express();
const port = process.env.PORT || 3000;

app.use(json());

// Register controllers
app.use('/api/cases', caseController);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
