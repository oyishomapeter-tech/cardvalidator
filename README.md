# Card Validator API

A simple Node.js API that validates credit card numbers using the Luhn algorithm.

## Project Summary

- Built with **Node.js**, **TypeScript**, and **Express**
- Uses **strict TypeScript** settings for safer code
- Validates card input in middleware
- Provides a `POST /validate-card` endpoint
- Includes unit tests with **Vitest**

## Folder Structure

- `src/index.ts` — Express application entrypoint
- `src/controllers/card.controller.ts` — Route handler for validation results
- `src/middleware/validateCardInput.ts` — Input validation middleware
- `src/services/luhn.service.ts` — Luhn algorithm implementation
- `src/__tests__/` — Unit tests for validation and algorithm logic

## Requirements

- Node.js 18+ (recommended)
- npm

## Setup

```bash
npm install
```

## Scripts

- `npm run build` — Compile TypeScript into `dist`
- `npm start` — Build and run the app
- `npm run dev` — Rebuild on file changes and restart the server
- `npm test` — Run Vitest tests

## Running the API

Start the server:

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

## API Endpoint

### `POST /validate-card`

Validates a card number and returns whether it is valid.

#### Request body

```json
{
  "cardNumber": "4532015112830366"
}
```

#### Successful response

```json
{
  "valid": true,
  "cardNumber": "****0366"
}
```

#### Validation failure response

```json
{
  "valid": false,
  "error": "cardNumber must be a string"
}
```

## Testing

Run unit tests with:

```bash
npm test
```

The repository includes tests for:

- Luhn algorithm correctness
- Input validation rules
- Edge cases and formatting

## Notes

- Input validation is handled in middleware before the controller.
- The Luhn algorithm is implemented as a reusable service.
- The API masks the card number in responses for security.
