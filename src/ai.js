const { Configuration, OpenAIApi } = require('openai');
const debug = require('debug')('bot:ai');
const utils = require('./utils');

module.exports = {
  send: async function (data) {
    debug.extend('send')('started');

    try {
      const config = new Configuration({
        organization: process.env.ORGANIZATION,
        apiKey: process.env.API_KEY
      });
      const openai = new OpenAIApi(config);
      const request = {
        model: 'text-davinci-003',
        max_tokens: 3500,
        temperature: 1,
        prompt: data
      };
      debug.extend('send')('request %O', request);
      const response = await openai.createCompletion(request);
      debug.extend('send')('response %O', response.data.choices);

      return utils.extract(response);
    } catch (error) {
      return `Oops, ${error.message.toLowerCase()}`;
    }
  }
};
