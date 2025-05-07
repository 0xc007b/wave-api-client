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
    console.log(`Balance: ${balance.amount} ${balance.currency}`);
    return balance;
  } catch (error) {
    console.error('Error getting balance:', error);
    throw error;
  }
}
```

## API Overview

The client provides access to the following Wave APIs:

- Balance & Reconciliation API
- Checkout API
- Payout API
- Merchants API
- Webhooks API ⚠️ (Deprecated and will be removed in a future version)

### Balance & Reconciliation API

```typescript
// Get current wallet balance
const balance = await waveClient.balance.getBalance();

// Get balance with optional parameters
const balanceWithSubaccounts = await waveClient.balance.getBalance({
  include_subaccounts: true
});

// List transactions
const transactions = await waveClient.balance.listTransactions({
  date: '2023-01-01',
  after: 'cursor_token',
  include_subaccounts: true
});

// Refund a transaction
await waveClient.balance.refundTransaction('transaction_id');
```

### Checkout API

```typescript
// Create a checkout session
const session = await waveClient.checkout.createSession({
  amount: '1000',
  currency: 'XOF',
  success_url: 'https://example.com/success',
  error_url: 'https://example.com/error',
  // Optional parameters
  cancel_url: 'https://example.com/cancel',
  client_reference: 'order_12345',
  aggregated_merchant_id: 'merchant_123',
  restrict_payer_mobile: '+221700000000'
});

// Get session details
const sessionDetails = await waveClient.checkout.getSession('session_123');

// Get session by transaction ID
const sessionByTx = await waveClient.checkout.getSessionByTransactionId('transaction_123');

// Search sessions by client reference
const sessions = await waveClient.checkout.searchSessions('order_12345');

// Refund a session
await waveClient.checkout.refundSession('session_123');

// Expire a session
await waveClient.checkout.expireSession('session_123');
```

### Payout API

```typescript
// Send a single payout (requires an idempotency key)
const payout = await waveClient.payout.createPayout({
  receive_amount: '5000',
  currency: 'XOF',
  mobile: '+221700000000',
  name: 'John Doe',
  // Optional parameters
  national_id: '1234567890',
  payment_reason: 'Salary payment',
  client_reference: 'payment_12345',
  aggregated_merchant_id: 'merchant_123'
}, 'unique-idempotency-key-123');

// Create a batch of payouts
const batch = await waveClient.payout.createPayoutBatch({
  payouts: [
    {
      receive_amount: '5000',
      currency: 'XOF',
      mobile: '+221700000000',
      name: 'John Doe',
      client_reference: 'payment_12345'
    },
    {
      receive_amount: '3000',
      currency: 'XOF',
      mobile: '+221700000001',
      name: 'Jane Smith',
      client_reference: 'payment_12346'
    },
  ]
}, 'batch-idempotency-key-123');

// Get payout details
const payoutDetails = await waveClient.payout.getPayout('payout_123');

// Get batch details
const batchDetails = await waveClient.payout.getPayoutBatch('batch_123');

// Search payouts by client reference
const payouts = await waveClient.payout.searchPayouts('payment_12345');

// Reverse a payout
await waveClient.payout.reversePayout('payout_123');
```

### Merchants API

```typescript
// List merchants
const merchants = await waveClient.merchants.listMerchants();

// List merchants with filters
const filteredMerchants = await waveClient.merchants.listMerchants({
  status: 'active',
  search: 'store',
  first: 10,
  after: 'cursor_token'
});

// Get merchant details
const merchant = await waveClient.merchants.getMerchant('merchant_123');
```

### Webhooks API (⚠️ Deprecated)

> **Warning:** The Webhooks API is deprecated and will be removed in a future version. Please migrate to alternative notification methods.

```typescript
// List webhooks
const webhooks = await waveClient.webhooks.listWebhooks();

// Create a webhook
const webhook = await waveClient.webhooks.createWebhook({
  url: 'https://example.com/webhook',
  events: ['checkout.session.completed', 'checkout.session.payment_failed'],
  security_strategy: 'signing_secret',
  description: 'Checkout notifications'
});

// Get webhook details
const webhookDetails = await waveClient.webhooks.getWebhook('webhook_123');

// Update a webhook
const updatedWebhook = await waveClient.webhooks.updateWebhook('webhook_123', {
  status: 'active',
  events: ['checkout.session.completed']
});

// Delete a webhook
await waveClient.webhooks.deleteWebhook('webhook_123');

// Verify webhook signature
const isValidSignature = waveClient.webhooks.verifySignatureSecret({
  payload: requestBody,
  signature: request.headers['wave-signature'],
  secret: 'webhook_signing_secret'
});

// Test a webhook
const testResult = await waveClient.webhooks.testWebhook('webhook_123');
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