/**
 * Luhn Algorithm Service
 * Validates credit card numbers using the Luhn checksum formula
 */

/**
 * Validates a credit card number using the Luhn Algorithm
 * @param cardNumber - The card number as a string (can include spaces/dashes)
 * @returns boolean - true if card number is valid, false otherwise
 *
 * Algorithm Steps:
 * 1. Clean the input (remove spaces and non-digit characters)
 * 2. Check if length is valid (13-19 digits)
 * 3. Convert to array of digits
 * 4. Process digits from RIGHT to LEFT:
 *    - Double every second digit
 *    - If doubled digit > 9, subtract 9
 * 5. Sum all processed digits
 * 6. Valid if sum is divisible by 10
 */
export function validateCardNumber(cardNumber: string): boolean {
  // Remove all whitespace and non-digit characters for consistency
  // This handles formatted cards like "4532-0151-1283-0366"
  const cleanedNumber = cardNumber.replace(/\s+/g, '').replace(/\D/g, '');

  // Validate length: standard credit cards have 13-19 digits
  // Visa: 16, Mastercard: 16, American Express: 15, Discover: 16
  if (cleanedNumber.length < 13 || cleanedNumber.length > 19) {
    return false;
  }

  // Convert string of digits into an array of numbers
  // "4532" becomes [4, 5, 3, 2]
  const digits = cleanedNumber.split('').map(Number);

  let sum = 0;

  // Process each digit from index 0 to end
  // We use modulo arithmetic to determine if position is even from RIGHT
  for (let i = 0; i < digits.length; i++) {
    // Calculate position from the right: (length - i - 1)
    // If position from right is odd, we need to double this digit
    // Example: for 4-digit number [4,5,3,2], positions from right are: 3,2,1,0
    //          we double at positions 1 and 3 (odd)
    const isEvenPositionFromRight = (digits.length - i - 1) % 2 === 1;

    let digit = digits[i];

    // Double the digit if it's at an even position from the right
    if (isEvenPositionFromRight) {
      digit *= 2;

      // If doubled digit exceeds 9, subtract 9
      // This is mathematically equivalent to summing the two digits
      // Example: 12 → 12 - 9 = 3 (same as 1 + 2 = 3)
      if (digit > 9) {
        digit -= 9;
      }
    }

    // Add the processed digit to the running sum
    sum += digit;
  }

  // The card is valid if the total sum is divisible by 10
  // This means sum % 10 equals 0 (no remainder)
  return sum % 10 === 0;
}
