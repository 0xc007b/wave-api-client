/**
 * Example of using the Wave API client to create a checkout session
 */
import { WaveClient } from '../src';

async function main() {
  // Initialize the client with your API key
  const waveClient = new WaveClient({
    apiKey: 'your_api_key_here', // Replace with your actual API key
    debug: true, // Enable debug logging
  });

  try {
    // Create a checkout session
    console.log('Creating checkout session...');
    const session = await waveClient.checkout.createSession({
      amount: '1000',
      currency: 'XOF',
      success_url: 'https://example.com/success',
      error_url: 'https://example.com/error',
      client_reference: '12345', // Optional reference for your system
      // Optional fields
      // restrict_payer_mobile: '+221XXXXXXXXX', // Restrict to specific payer
      // aggregated_merchant_id: 'am-xxxxxxxxxxxx', // Aggregated merchant ID
    });

    console.log('Checkout session created successfully:', session);
    console.log('\nCheckout URL:', session.wave_launch_url);
    console.log('\nSession ID:', session.id);
    console.log('Session expires at:', new Date(session.when_expires).toLocaleString());

    // Retrieve the session
    console.log('\nRetrieving checkout session...');
    const retrievedSession = await waveClient.checkout.getSession(session.id);
    console.log('Retrieved session status:', retrievedSession.checkout_status);
    console.log('Payment status:', retrievedSession.payment_status);

    // You can also search for sessions by client reference
    console.log('\nSearching for sessions with client reference:', session.client_reference);
    const searchResults = await waveClient.checkout.searchSessions(session.client_reference || '12345');
    console.log(`Found ${searchResults.result.length} sessions`);

    // Example of how to handle a payment error
    if (retrievedSession.last_payment_error) {
      console.log('Payment error:', retrievedSession.last_payment_error.code);
      console.log('Error message:', retrievedSession.last_payment_error.message);
    }

    console.log('\nOperations you can perform on a session:');
    console.log('1. Refund a session: waveClient.checkout.refundSession(sessionId)');
    console.log('2. Expire a session: waveClient.checkout.expireSession(sessionId)');
    console.log('3. Get by transaction ID: waveClient.checkout.getSessionByTransactionId(transactionId)');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main().catch(console.error);