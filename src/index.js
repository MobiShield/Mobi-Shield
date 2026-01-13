const cron = require('node-cron');
const { getCurrentPrice } = require('./priceMonitor');
const DipDetector = require('./dipDetector');
const { buyWithAllBalance } = require('./buyBack');
const { CHECK_INTERVAL } = require('./config');

const detector = new DipDetector();

async function checkAndAct() {
  const price = await getCurrentPrice();
  if (price === null) return;

  console.log(`Current price: $${price}`);

  detector.updatePrice(price);

  if (detector.isDip(price)) {
    console.log('Dip detected! Initiating buy back...');
    try {
      await buyWithAllBalance();
      detector.resetPeak(); // Reset peak after buy
      console.log('Buy back completed.');
    } catch (error) {
      console.error('Buy back failed:', error);
    }
  }
}

function startBot() {
  console.log('Starting Pysopstrategy bot...');
  cron.schedule(CHECK_INTERVAL, checkAndAct);
  // Run once immediately
  checkAndAct();
}

startBot();