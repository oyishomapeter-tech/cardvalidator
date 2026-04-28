import express, { type Request, type Response } from 'express';
import { validateCardController } from './controllers/card.controller';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.post('/validate-card', validateCardController);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Card validator API listening on http://localhost:${port}`);
});
