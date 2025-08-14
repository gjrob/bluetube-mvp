// scripts/check-revenue.js
// Quick revenue check for BlueTubeTV

const { ethers } = require('ethers');

console.log(`
💰 ============================================
🌊 BlueTubeTV REVENUE CHECK
💎 Money Printer Status Report
============================================
`);

async function checkRevenue() {
  // Blockchain Revenue
  const contractAddress = '0xD699d61Ce1554d4f7ef4b853283845F354f8a9Db';
  const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
  
  try {
    const balance = await provider.getBalance(contractAddress);
    console.log(`
🔗 BLOCKCHAIN REVENUE:
   Contract Address: ${contractAddress}
   Contract Balance: ${ethers.formatEther(balance)} ETH
   Platform Fee (5%): You earn 5% of all SuperChats
   Status: LIVE on Sepolia Testnet
`);
  } catch (error) {
    console.log('❌ Blockchain check failed:', error.message);
  }
  
  // Stripe Revenue (if configured)
  if (process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const balance = await stripe.balance.retrieve();
      console.log(`
💳 STRIPE REVENUE:
   Available: $${(balance.available[0]?.amount || 0) / 100}
   Pending: $${(balance.pending[0]?.amount || 0) / 100}
   Currency: ${balance.available[0]?.currency?.toUpperCase() || 'USD'}
`);
    } catch (error) {
      console.log('💳 Stripe: Configure STRIPE_SECRET_KEY in .env.local');
    }
  } else {
    console.log('💳 Stripe: Not configured yet');
  }
  
  // Revenue Projections
  console.log(`
📈 REVENUE PROJECTIONS:
   Daily (10 SuperChats): $50 revenue → $2.50 earnings
   Weekly (70 SuperChats): $350 revenue → $17.50 earnings
   Monthly (300 SuperChats): $1,500 revenue → $75 earnings
   Yearly (3,600 SuperChats): $18,000 revenue → $900 earnings
   
🚀 GROWTH TARGETS:
   100 active creators = $9,000/year
   1,000 active creators = $90,000/year
   10,000 active creators = $900,000/year
   
============================================
💎 YOUR MONEY PRINTER IS READY TO SCALE!
============================================
`);
}

checkRevenue();