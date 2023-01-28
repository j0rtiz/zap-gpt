const debug = require('debug')('bot:utils');

module.exports = {
  extract: function ({ data }) {
    debug.extend('extract')('started');
    let result = '';

    for (const { text } of data.choices) {
      result += text;
    }

    debug.extend('extract')('result %O', { result });
    return result.split('\n\n').slice(1).join('\n\n') || result;
  }
};
