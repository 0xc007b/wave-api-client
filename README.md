# Wave API Client

A TypeScript client for Wave API, providing a simple and type-safe way to interact with [Wave's payment services](https://docs.wave.com/business).

[![npm version](https://badge.fury.io/js/wave-api-client.svg)](https://badge.fury.io/js/wave-api-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔒 Type-safe API for Wave services
- 🚀 Promises-based API
- 📦 Modular design
- 📘 Comprehensive documentation
- ✅ Complete error handling
- 🧪 Test coverage

## Installation

```bash
npm install wave-api-client
# or
yarn add wave-api-client
```

## Getting Started

```typescript
import { WaveClient } from 'wave-api-client';

// Initialize the client with your API key
const waveClient = new WaveClient({
  apiKey: 'wave_sn_prod_xxxx', // Replace with your API key
  // Optional configuration
  // baseUrl: 'https://api.wave.com',
  // timeout: 30000, // 30 seconds
  // debug: false
});

// Use the client to interact with Wave API
async function getBalance() {
  try {
    const balance = await waveClient.balance.getBalance();
    console.log(`Balance: ${balance.available} ${balance.currency}`);
    return balance;
  } catch (error) {
    console.error('Error getting balance:', error);
    throw error;
  }
}
```

## API Overview

The client provides access to the following Wave APIs:

### Balance & Reconciliation API

```typescript
// Get current wallet balance
const balance = await waveClient.balance.getBalance();

// List transactions
const transactions = await waveClient.balance.listTransactions({
  limit: 10,
  start_date: '2023-01-01T00:00:00Z',
});

// Get transaction details
const transaction = await waveClient.balance.getTransaction('tx_123');
```

### Checkout API

```typescript
// Create a checkout session
const session = await waveClient.checkout.createSession({
  amount: '1000',
  currency: 'XOF',
  success_url: 'https://example.com/success',
  error_url: 'https://example.com/error',
});

// Get session details
const sessionDetails = await waveClient.checkout.getSession('session_123');
```

### Payout API

```typescript
// Send a single payout
const payout = await waveClient.payout.createPayout({
  amount: '5000',
  currency: 'XOF',
  mobile: '+221700000000',
  recipient_name: 'John Doe',
});

// Create a batch of payouts
const batch = await waveClient.payout.createPayoutBatch({
  payouts: [
    {
      amount: '5000',
      currency: 'XOF',
      mobile: '+221700000000',
      recipient_name: 'John Doe',
    },
    {
      amount: '3000',
      currency: 'XOF',
      mobile: '+221700000001',
      recipient_name: 'Jane Smith',
    },
  ],
});
```

## Error Handling

The client provides detailed error information with proper typing:

```typescript
import { WaveApiError, ValidationError } from 'wave-api-client';

try {
  await waveClient.checkout.createSession({
    // Invalid request
  });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation error:', error.message, error.details);
  } else if (error instanceof WaveApiError) {
    console.error(`API error (${error.statusCode}):`, error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Documentation

For detailed documentation, see:

- [API Reference](https://docs.wave.com/business)
- [Wave API Documentation](https://docs.wave.com/business)

## Development

```bash
# Clone the repository
git clone https://github.com/0xc007b/wave-api-client.git
cd wave-api-client

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Lint the code
npm run lint
```

## License

MIT
