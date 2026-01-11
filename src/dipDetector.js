const { DIP_THRESHOLD } = require('./config');

class DipDetector {
  constructor() {
    this.localPeak = null;
  }

  updatePrice(price) {
    if (this.localPeak === null || price > this.localPeak) {
      this.localPeak = price;
    }
  }

  isDip(price) {
    if (this.localPeak === null) return false;
    const dipAmount = (this.localPeak - price) / this.localPeak;
    return dipAmount >= DIP_THRESHOLD;
  }

  resetPeak() {
    this.localPeak = null; // Reset after buy or something
  }
}

module.exports = DipDetector;