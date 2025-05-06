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
      metadata: {
        order_id: '12345',
        customer_id: '67890',
      },
    });

    console.log('Checkout session created successfully:', session);
    console.log('\nCheckout URL:', session.checkout_url);
    console.log('\nSession ID:', session.id);
    console.log('Session expires at:', new Date(session.expires_at).toLocaleString());

    // Retrieve the session
    console.log('\nRetrieving checkout session...');
    const retrievedSession = await waveClient.checkout.getSession(session.id);
    console.log('Retrieved session status:', retrievedSession.status);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main().catch(console.error);