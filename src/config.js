require('dotenv').config();

module.exports = {
  SOLANA_RPC_URL: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  TOKEN_MINT: process.env.TOKEN_MINT, // The token to monitor and buy
  DIP_THRESHOLD: 0.3, // 30%
  CHECK_INTERVAL: '*/5 * * * *', // Every 5 minutes
  DEXSCREENER_API: 'https://api.dexscreener.com/latest/dex/tokens/',
};