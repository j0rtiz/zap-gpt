const bot = require('./src/bot');
require('dotenv').config();

(async function () {
  await bot.start();
})();
