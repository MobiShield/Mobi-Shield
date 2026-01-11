const axios = require('axios');
const { TOKEN_MINT, DEXSCREENER_API } = require('./config');

async function getCurrentPrice() {
  try {
    const response = await axios.get(`${DEXSCREENER_API}${TOKEN_MINT}`);
    const data = response.data;
    if (data.pairs && data.pairs.length > 0) {
      // Assuming the first pair is the relevant one
      const pair = data.pairs[0];
      return parseFloat(pair.priceUsd);
    }
    throw new Error('No price data found');
  } catch (error) {
    console.error('Error fetching price:', error.message);
    return null;
  }
}

module.exports = { getCurrentPrice };