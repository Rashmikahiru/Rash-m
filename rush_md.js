const fs = require('fs');
const path = require('path');

const savePath = path.join(__dirname, 'index.js');

async function start() {
  try {
    if (fs.existsSync(savePath)) {
      const yasiyaMd = require(savePath);
      await yasiyaMd();
    } else {
      console.warn('⚠️ index.js not found at:', savePath);
    }
  } catch (error) {
    console.error('❌ Error in start RUSH-MD():', error);
  }
}

start();
