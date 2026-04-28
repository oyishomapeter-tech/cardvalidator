import express, { type Request, type Response } from 'express';
import { validateCardController } from './controllers/card.controller';
import { validateCardInputMiddleware } from './middleware/validateCardInput';

const app = express();
const port = Number(process.env.PORT ?? 3000);

// Middleware to parse incoming JSON requests
app.use(express.json());

// POST /validate-card endpoint
// First runs validateCardInputMiddleware (validates input)
// Then runs validateCardController (processes the card)
app.post('/validate-card', validateCardInputMiddleware, validateCardController);

// 404 handler for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(port, () => {
  console.log(`Card validator API listening on http://localhost:${port}`);
});
