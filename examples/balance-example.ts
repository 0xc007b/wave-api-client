/**
 * Example of using the Wave API client to interact with the Balance API
 */
import { WaveClient } from '../src';

async function main() {
  // Initialize the client with your API key
  const waveClient = new WaveClient({
    apiKey: 'your_api_key_here', // Replace with your actual API key
    debug: true, // Enable debug logging
  });

  try {
    // Get current balance
    console.log('Getting current balance...');
    const balance = await waveClient.balance.getBalance();
    console.log(`Current balance: ${balance.amount} ${balance.currency}`);

    // Get current balance including subaccounts
    console.log('\nGetting balance with subaccounts...');
    const balanceWithSubs = await waveClient.balance.getBalance({ include_subaccounts: true });
    console.log(`Balance with subaccounts: ${balanceWithSubs.amount} ${balanceWithSubs.currency}`);

    // List transactions for today
    console.log('\nListing transactions for today...');
    const transactions = await waveClient.balance.listTransactions();
    console.log(`Found ${transactions.items.length} transactions`);
    console.log('Date:', transactions.date);
    
    if (transactions.items.length > 0) {
      console.log('\nFirst transaction details:');
      const tx = transactions.items[0];
      console.log(`- ID: ${tx.transaction_id}`);
      console.log(`- Amount: ${tx.amount} ${tx.currency}`);
      console.log(`- Fee: ${tx.fee}`);
      console.log(`- Type: ${tx.transaction_type || 'Unknown'}`);
      console.log(`- Timestamp: ${tx.timestamp}`);
      if (tx.counterparty_name) {
        console.log(`- Counterparty: ${tx.counterparty_name} (${tx.counterparty_mobile || 'Unknown mobile'})`);
      }
    }

    // Check for pagination
    if (transactions.page_info.has_next_page) {
      console.log('\nMore transactions available, you can fetch them with:');
      console.log(`waveClient.balance.listTransactions({ after: '${transactions.page_info.end_cursor}' })`);
    }

    // Demo of how to handle multiple pages
    console.log('\nExample of how to fetch all transactions for a specific date:');
    console.log(`
async function getAllTransactionsForDate(date) {
  let allTransactions = [];
  let hasNext = true;
  let cursor = null;
  
  while (hasNext) {
    const params = { date };
    if (cursor) params.after = cursor;
    
    const result = await waveClient.balance.listTransactions(params);
    allTransactions = [...allTransactions, ...result.items];
    
    hasNext = result.page_info.has_next_page;
    cursor = result.page_info.end_cursor;
  }
  
  return allTransactions;
}`);

    // Example of how to refund a transaction
    if (transactions.items.length > 0) {
      // Note: This is just an example and is commented out to prevent actual refunds
      console.log('\nExample of how to refund a transaction (not executed):');
      console.log(`await waveClient.balance.refundTransaction('${transactions.items[0].transaction_id}')`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main().catch(console.error);