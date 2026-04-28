import { describe, it, expect } from 'vitest';
import { validateCardInputForTesting } from '../middleware/validateCardInput';

describe('validateCardInputForTesting - Input Validation', () => {
  describe('Type validation', () => {
    it('should reject undefined', () => {
      const result = validateCardInputForTesting(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('cardNumber field is required');
    });

    it('should reject null', () => {
      const result = validateCardInputForTesting(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('cardNumber field is required');
    });

    it('should reject number type', () => {
      const result = validateCardInputForTesting(4532015112830366);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('cardNumber must be a string');
    });

    it('should reject array type', () => {
      const result = validateCardInputForTesting(['4532015112830366']);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('cardNumber must be a string');
    });

    it('should reject object type', () => {
      const result = validateCardInputForTesting({ cardNumber: '4532015112830366' });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('cardNumber must be a string');
    });

    it('should reject boolean type', () => {
      const result = validateCardInputForTesting(true);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('cardNumber must be a string');
    });
  });

  describe('Empty validation', () => {
    it('should reject empty string', () => {
      const result = validateCardInputForTesting('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('cardNumber cannot be empty');
    });

    it('should reject string with only spaces', () => {
      const result = validateCardInputForTesting('     ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('cardNumber cannot be empty');
    });

    it('should reject string with only tabs', () => {
      const result = validateCardInputForTesting('\t\t\t');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('cardNumber cannot be empty');
    });

    it('should reject string with only newlines', () => {
      const result = validateCardInputForTesting('\n\n');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('cardNumber cannot be empty');
    });
  });

  describe('Character validation', () => {
    it('should accept valid digits only', () => {
      const result = validateCardInputForTesting('4532015112830366');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept digits with spaces', () => {
      const result = validateCardInputForTesting('4532 0151 1283 0366');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept digits with dashes', () => {
      const result = validateCardInputForTesting('4532-0151-1283-0366');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept digits with mixed spaces and dashes', () => {
      const result = validateCardInputForTesting('4532-0151 1283-0366');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject letters', () => {
      const result = validateCardInputForTesting('4532015112830A66');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('cardNumber must contain only digits, spaces, and dashes');
    });

    it('should reject special characters (@, #, $, etc)', () => {
      const result = validateCardInputForTesting('4532@0151#1283$0366');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('cardNumber must contain only digits, spaces, and dashes');
    });

    it('should reject parentheses', () => {
      const result = validateCardInputForTesting('(4532) 0151-1283-0366');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('cardNumber must contain only digits, spaces, and dashes');
    });

    it('should reject decimal point', () => {
      const result = validateCardInputForTesting('4532.015112830366');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('cardNumber must contain only digits, spaces, and dashes');
    });

    it('should reject plus sign', () => {
      const result = validateCardInputForTesting('+4532015112830366');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('cardNumber must contain only digits, spaces, and dashes');
    });

    it('should reject comma', () => {
      const result = validateCardInputForTesting('4532,015112830366');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('cardNumber must contain only digits, spaces, and dashes');
    });
  });

  describe('Length validation', () => {
    it('should reject 12 digits (too short)', () => {
      const result = validateCardInputForTesting('453201511283');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('cardNumber must be at least 13 digits');
    });

    it('should accept 13 digits (minimum valid)', () => {
      const result = validateCardInputForTesting('7992739871348');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept 16 digits (typical credit card)', () => {
      const result = validateCardInputForTesting('4532015112830366');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept 19 digits (maximum valid)', () => {
      const result = validateCardInputForTesting('6011111111111117411');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject 20 digits (too long)', () => {
      const result = validateCardInputForTesting('45320151128303664532');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('cardNumber must not exceed 19 digits');
    });

    it('should count only digits, ignore separators for length', () => {
      // "4532-0151-1283-0366" has 16 digits (dashes don't count)
      const result = validateCardInputForTesting('4532-0151-1283-0366');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject if formatted card becomes too short', () => {
      // "4532-01 51" has only 6 digits
      const result = validateCardInputForTesting('4532-01 51');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('cardNumber must be at least 13 digits');
    });
  });

  describe('Validation order (first failure returned)', () => {
    it('should return type error before empty error', () => {
      const result = validateCardInputForTesting(123);
      expect(result.error).toBe('cardNumber must be a string');
    });

    it('should return empty error before character error', () => {
      // This will fail type first, but if we pass a string
      const result = validateCardInputForTesting('   ');
      expect(result.error).toBe('cardNumber cannot be empty');
    });

    it('should return character error before length error', () => {
      // String with invalid characters that would be short after cleaning
      const result = validateCardInputForTesting('4532@01');
      expect(result.error).toBe('cardNumber must contain only digits, spaces, and dashes');
    });
  });

  describe('Edge cases', () => {
    it('should handle leading spaces in otherwise valid card', () => {
      const result = validateCardInputForTesting('   4532015112830366');
      expect(result.isValid).toBe(true);
    });

    it('should handle trailing spaces in otherwise valid card', () => {
      const result = validateCardInputForTesting('4532015112830366   ');
      expect(result.isValid).toBe(true);
    });

    it('should handle multiple consecutive spaces', () => {
      const result = validateCardInputForTesting('4532     0151     1283     0366');
      expect(result.isValid).toBe(true);
    });

    it('should handle multiple consecutive dashes', () => {
      const result = validateCardInputForTesting('4532--0151--1283--0366');
      expect(result.isValid).toBe(true);
    });

    it('should accept single digit repeated 13+ times', () => {
      const result = validateCardInputForTesting('1111111111111');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});
