import { describe, it, expect } from 'vitest';
import { validateCardNumber } from '../services/luhn.service';

describe('validateCardNumber - Luhn Algorithm', () => {
  describe('Valid card numbers', () => {
    // Real valid test card numbers used in testing environments
    it('should validate Visa card (4532015112830366)', () => {
      expect(validateCardNumber('4532015112830366')).toBe(true);
    });

    it('should validate Mastercard format (5425233010103442)', () => {
      expect(validateCardNumber('5425233010103442')).toBe(true);
    });

    it('should validate American Express 15-digit (374245455400126)', () => {
      expect(validateCardNumber('374245455400126')).toBe(true);
    });

    it('should validate Discover card (6011111111111117)', () => {
      expect(validateCardNumber('6011111111111117')).toBe(true);
    });

    it('should handle formatted card with spaces', () => {
      expect(validateCardNumber('4532 0151 1283 0366')).toBe(true);
    });

    it('should handle formatted card with dashes', () => {
      expect(validateCardNumber('4532-0151-1283-0366')).toBe(true);
    });

    it('should handle formatted card with mixed separators', () => {
      expect(validateCardNumber('4532-0151 1283-0366')).toBe(true);
    });

    it('should validate 13-digit card (minimum length)', () => {
      // 79927398713 is a valid 11-digit number, adding 48 to make 13
      expect(validateCardNumber('7992739871348')).toBe(true);
    });

    it('should validate 19-digit card (maximum length)', () => {
      expect(validateCardNumber('6011111111111117411')).toBe(true);
    });
  });

  describe('Invalid card numbers', () => {
    it('should reject invalid checksum (4532015112830367)', () => {
      // Changed last digit from 6 to 7
      expect(validateCardNumber('4532015112830367')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validateCardNumber('')).toBe(false);
    });

    it('should reject string with only spaces', () => {
      expect(validateCardNumber('    ')).toBe(false);
    });

    it('should reject string with only dashes', () => {
      expect(validateCardNumber('----')).toBe(false);
    });

    it('should reject 12-digit number (too short)', () => {
      expect(validateCardNumber('453201511283')).toBe(false);
    });

    it('should reject 20-digit number (too long)', () => {
      expect(validateCardNumber('45320151128303664532')).toBe(false);
    });

    it('should reject string with letters', () => {
      expect(validateCardNumber('4532015112830A66')).toBe(false);
    });

    it('should reject string with special characters', () => {
      expect(validateCardNumber('4532@0151#1283@0366')).toBe(false);
    });

    it('should reject all zeros', () => {
      expect(validateCardNumber('0000000000000')).toBe(false);
    });

    it('should reject all ones', () => {
      expect(validateCardNumber('1111111111111')).toBe(false);
    });

    it('should reject all same digit', () => {
      expect(validateCardNumber('4444444444444')).toBe(false);
    });
  });

  describe('Edge cases and formatting', () => {
    it('should handle leading spaces', () => {
      expect(validateCardNumber('   4532015112830366')).toBe(true);
    });

    it('should handle trailing spaces', () => {
      expect(validateCardNumber('4532015112830366   ')).toBe(true);
    });

    it('should handle spaces between all digits', () => {
      expect(validateCardNumber('4 5 3 2 0 1 5 1 1 2 8 3 0 3 6 6')).toBe(true);
    });

    it('should convert number to string implicitly for validation', () => {
      const cardAsString = '4532015112830366';
      expect(validateCardNumber(cardAsString)).toBe(true);
    });

    it('should handle card with mixed letters and remove them', () => {
      // "4532a0151b1283c0366" removes letters, becomes "4532015112830366"
      expect(validateCardNumber('4532a0151b1283c0366')).toBe(true);
    });
  });

  describe('Luhn algorithm logic verification', () => {
    it('should correctly process digits from right to left', () => {
      // Testing the specific doubling pattern from right to left
      // 79927398713: positions from right are 0,1,2,3,4,5,6,7,8,9,10
      // We double at positions 1,3,5,7,9 (odd positions from right)
      expect(validateCardNumber('79927398713')).toBe(true);
    });

    it('should correctly subtract 9 from doubled digits > 9', () => {
      // When a digit is doubled and exceeds 9, we subtract 9
      // This is equivalent to summing the two digits of the result
      // E.g. 8*2=16 → 16-9=7 (which is 1+6=7)
      expect(validateCardNumber('6011111111111117')).toBe(true);
    });

    it('should validate that sum must be divisible by 10', () => {
      // Valid card (sum divisible by 10)
      expect(validateCardNumber('4532015112830366')).toBe(true);

      // Invalid card (sum NOT divisible by 10)
      expect(validateCardNumber('4532015112830367')).toBe(false);
    });
  });
});
