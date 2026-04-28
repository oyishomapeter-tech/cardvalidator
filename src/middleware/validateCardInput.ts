import { type Request, type Response, type NextFunction } from 'express';

/**
 * Validation Result Interface
 * Contains the result of input validation
 */
interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates that the input is a non-empty string
 * @param cardNumber - The input to validate
 * @returns ValidationResult with error message if invalid
 */
function validateInputType(cardNumber: unknown): ValidationResult {
  if (cardNumber === null || cardNumber === undefined) {
    return {
      isValid: false,
      error: 'cardNumber field is required',
    };
  }

  if (typeof cardNumber !== 'string') {
    return {
      isValid: false,
      error: 'cardNumber must be a string',
    };
  }

  return { isValid: true };
}

/**
 * Validates that the input is not empty or only whitespace
 * @param cardNumber - The input to validate
 * @returns ValidationResult with error message if invalid
 */
function validateNotEmpty(cardNumber: string): ValidationResult {
  const trimmed = cardNumber.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: 'cardNumber cannot be empty',
    };
  }

  return { isValid: true };
}

/**
 * Validates that the input contains only digits and allowed separators
 * Allowed characters: digits (0-9), spaces, dashes
 * @param cardNumber - The input to validate
 * @returns ValidationResult with error message if invalid
 */
function validateCharacters(cardNumber: string): ValidationResult {
  // Pattern: only digits (0-9), spaces, and dashes allowed
  const validCharacterPattern = /^[\d\s\-]+$/;

  if (!validCharacterPattern.test(cardNumber)) {
    return {
      isValid: false,
      error: 'cardNumber must contain only digits, spaces, and dashes',
    };
  }

  return { isValid: true };
}

/**
 * Validates that after cleaning, the card number is the correct length
 * Valid credit card lengths: 13-19 digits
 * @param cardNumber - The input to validate
 * @returns ValidationResult with error message if invalid
 */
function validateLength(cardNumber: string): ValidationResult {
  // Remove all non-digit characters to get the clean card number
  const cleanedNumber = cardNumber.replace(/\D/g, '');

  // Check minimum length (13 digits)
  if (cleanedNumber.length < 13) {
    return {
      isValid: false,
      error: 'cardNumber must be at least 13 digits',
    };
  }

  // Check maximum length (19 digits)
  if (cleanedNumber.length > 19) {
    return {
      isValid: false,
      error: 'cardNumber must not exceed 19 digits',
    };
  }

  return { isValid: true };
}

/**
 * Comprehensive validation for card number input
 * Runs all validation checks in sequence
 * @param cardNumber - The input to validate
 * @returns ValidationResult with error message if any validation fails
 */
function validateCardInput(cardNumber: unknown): ValidationResult {
  // Step 1: Validate type
  const typeValidation = validateInputType(cardNumber);
  if (!typeValidation.isValid) {
    return typeValidation;
  }

  // At this point, cardNumber is guaranteed to be a string
  const cardNumberStr = cardNumber as string;

  // Step 2: Validate not empty
  const emptyValidation = validateNotEmpty(cardNumberStr);
  if (!emptyValidation.isValid) {
    return emptyValidation;
  }

  // Step 3: Validate characters
  const charValidation = validateCharacters(cardNumberStr);
  if (!charValidation.isValid) {
    return charValidation;
  }

  // Step 4: Validate length
  const lengthValidation = validateLength(cardNumberStr);
  if (!lengthValidation.isValid) {
    return lengthValidation;
  }

  // All validations passed
  return { isValid: true };
}

// Export for testing purposes (allows tests to verify validation logic directly)
export { validateCardInput as validateCardInputForTesting };


/**
 * Middleware to validate card number input
 * Runs before the controller and checks all input requirements
 * If validation fails, returns 400 error and stops the request
 * If validation passes, calls next() to proceed to the controller
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function to continue to next middleware/controller
 */
export function validateCardInputMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Extract cardNumber from request body
  const { cardNumber } = req.body ?? {};

  // Validate input using validation logic
  const validation = validateCardInput(cardNumber);

  // If validation failed, send 400 error and stop processing
  if (!validation.isValid) {
    res.status(400).json({
      valid: false,
      error: validation.error,
    });
    return;
  }

  // Validation passed, proceed to next middleware/controller
  next();
}

