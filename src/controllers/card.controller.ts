import { type Request, type Response } from 'express';
import { validateCardNumber } from '../services/luhn.service';

function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length <= 4) {
    return cleaned;
  }

  const visibleDigits = cleaned.slice(-4);
  const maskedDigits = cleaned.slice(0, -4).replace(/\d/g, '*');
  return `${maskedDigits}${visibleDigits}`;
}

export function validateCardController(req: Request, res: Response): void {
  const { cardNumber } = req.body ?? {};

  if (typeof cardNumber !== 'string') {
    res.status(400).json({
      valid: false,
      error: 'cardNumber is required and must be a string',
    });
    return;
  }

  const valid = validateCardNumber(cardNumber);
  const maskedCardNumber = maskCardNumber(cardNumber);

  res.json({
    valid,
    cardNumber: maskedCardNumber,
  });
}
