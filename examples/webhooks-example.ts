/**
 * Example of using the Wave API client for webhook management and verification
 */
import { WaveClient, WebhookEvent, WebhookSecurityStrategy } from '../src';
import * as http from 'http';

async function main() {
  // Initialize the client with your API key
  const waveClient = new WaveClient({
    apiKey: 'your_api_key_here', // Replace with your actual API key
    debug: true, // Enable debug logging
  });

  try {
    // Create a new webhook with signing secret strategy
    console.log('Creating a new webhook...');
    const webhook = await waveClient.webhooks.createWebhook({
      url: 'https://your-server.com/wave-webhooks',
      events: [
        WebhookEvent.CHECKOUT_SESSION_COMPLETED,
        WebhookEvent.MERCHANT_PAYMENT_RECEIVED
      ],
      security_strategy: WebhookSecurityStrategy.SIGNING_SECRET,
      description: 'Webhook for receiving checkout and payment events'
    });

    console.log('Webhook created successfully:');
    console.log('- ID:', webhook.id);
    console.log('- URL:', webhook.url);
    console.log('- Events:', webhook.events.join(', '));
    console.log('- Security Strategy:', webhook.security_strategy);
    console.log('- Secret:', webhook.secret); // This is shown only once after creation

    // Store this secret securely as it won't be shown again
    const webhookSecret = webhook.secret || 'your_stored_secret';

    // List all webhooks
    console.log('\nListing all webhooks...');
    const webhooks = await waveClient.webhooks.listWebhooks();
    console.log(`Found ${webhooks.items.length} webhooks`);
    
    // Example of webhook verification - shared secret
    console.log('\nExample handler for verifying a webhook with shared secret strategy:');
    console.log(`
function handleSharedSecretWebhook(req, res) {
  // Get the Authorization header
  const authHeader = req.headers.authorization;
  
  // Verify the shared secret
  const isValid = waveClient.webhooks.verifySharedSecret({
    authHeader,
    secret: '${webhookSecret}'
  });
  
  if (!isValid) {
    console.error('Invalid webhook authentication');
    res.statusCode = 401;
    res.end('Unauthorized');
    return;
  }
  
  // Process webhook payload
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', () => {
    const event = JSON.parse(body);
    console.log('Received event:', event.type);
    
    // Handle specific event types
    if (event.type === '${WebhookEvent.CHECKOUT_SESSION_COMPLETED}') {
      const checkoutData = event.data;
      console.log('Checkout completed:', checkoutData.id);
      // Process the completed checkout...
    }
    
    res.statusCode = 200;
    res.end('OK');
  });
}`);

    // Example of webhook verification - signing secret
    console.log('\nExample handler for verifying a webhook with signing secret strategy:');
    console.log(`
function handleSigningSecretWebhook(req, res) {
  // Get the Wave-Signature header
  const signature = req.headers['wave-signature'];
  
  // Read the raw request body
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', () => {
    // Verify the signature
    const isValid = waveClient.webhooks.verifySignatureSecret({
      payload: body,
      signature,
      secret: '${webhookSecret}'
    });
    
    if (!isValid) {
      console.error('Invalid webhook signature');
      res.statusCode = 401;
      res.end('Unauthorized');
      return;
    }
    
    // Process the webhook payload
    const event = JSON.parse(body);
    console.log('Received event:', event.type);
    
    // Handle specific event types
    if (event.type === '${WebhookEvent.MERCHANT_PAYMENT_RECEIVED}') {
      const paymentData = event.data;
      console.log('Payment received:', paymentData.id, paymentData.amount, paymentData.currency);
      // Process the payment...
    }
    
    res.statusCode = 200;
    res.end('OK');
  });
}`);

    // Example of how to create a simple server to receive webhooks
    console.log('\nExample of how to create a simple webhook server:');
    console.log(`
// Create a simple HTTP server to receive webhooks
const server = http.createServer((req, res) => {
  if (req.url === '/wave-webhooks' && req.method === 'POST') {
    const securityStrategy = '${webhook.security_strategy}';
    
    if (securityStrategy === '${WebhookSecurityStrategy.SHARED_SECRET}') {
      handleSharedSecretWebhook(req, res);
    } else if (securityStrategy === '${WebhookSecurityStrategy.SIGNING_SECRET}') {
      handleSigningSecretWebhook(req, res);
    } else {
      res.statusCode = 400;
      res.end('Invalid security strategy');
    }
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

server.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});`);
    
    // Test a webhook
    console.log('\nYou can test your webhook with:');
    console.log(`await waveClient.webhooks.testWebhook('${webhook.id}')`);
    
    // Update a webhook
    console.log('\nTo update a webhook:');
    console.log(`await waveClient.webhooks.updateWebhook('${webhook.id}', {
  status: 'inactive' // To temporarily disable it
})`);
    
    // Delete a webhook
    console.log('\nTo delete a webhook:');
    console.log(`await waveClient.webhooks.deleteWebhook('${webhook.id}')`);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
// main().catch(console.error);  // Commented out to prevent actual API calls