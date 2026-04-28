import { type Request, type Response } from 'express';
import { validateCardNumber } from '../services/luhn.service';

/**
 * Masks a card number to show only the last 4 digits
 * Example: "4532015112830366" becomes "****0366"
 * @param cardNumber - The card number to mask (digits only)
 * @returns Masked card number string
 */
function maskCardNumber(cardNumber: string): string {
  // Remove all non-digit characters to get clean card number
  const cleaned = cardNumber.replace(/\D/g, '');

  // If 4 digits or fewer, return as-is (no masking needed)
  if (cleaned.length <= 4) {
    return cleaned;
  }

  // Take last 4 visible digits
  const visibleDigits = cleaned.slice(-4);

  // Mask earlier digits with asterisks (replace each digit with *)
  const maskedDigits = cleaned.slice(0, -4).replace(/\d/g, '*');

  // Combine masked + visible portions
  return `${maskedDigits}${visibleDigits}`;
}

/**
 * Handles POST /validate-card requests
 * Assumes input is valid (middleware already validated it)
 * Validates card using Luhn algorithm and returns result
 * @param req - Express request with validated cardNumber in body
 * @param res - Express response
 */
export function validateCardController(req: Request, res: Response): void {
  // Input is guaranteed to be valid by middleware
  // Extract validated cardNumber from request body
  const cardNumber = req.body.cardNumber as string;

  // Validate card using Luhn algorithm
  const valid = validateCardNumber(cardNumber);

  // Mask the card number for security
  const maskedCardNumber = maskCardNumber(cardNumber);

  // Return validation result with masked card number
  res.json({
    valid,
    cardNumber: maskedCardNumber,
  });
}
