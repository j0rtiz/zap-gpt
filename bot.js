const { Configuration, OpenAIApi } = require('openai');
const { create } = require('venom-bot');
require('dotenv').config();

const config = new Configuration({ organization: process.env.ORGANIZATION, apiKey: process.env.API_KEY });
const openai = new OpenAIApi(config);

create({ session: 'chat-gpt', multidevice: true, useChrome: false }).then(start).catch(console.error);

async function start(client) {
  client.onAnyMessage((message) => dialog(client, message));
}

async function dialog(client, message) {
  const { from, isGroupMsg, text } = message;
  console.log({ from, text });

  if (isGroupMsg) {
    console.log('group');
    return;
  }

  if (text && text.charAt() === ' ') {
    console.log('bot');
    return;
  }

  if (from === process.env.ME && text.charAt() !== '.') {
    console.log('me');
    return;
  }

  const response = await getDavinciResponse(text);
  console.log({ response });

  client.sendText(from, ` ${response}`);
}

async function getDavinciResponse(input) {
  if (input.charAt() === '.') {
    input = input.slice(1);
  }
  console.log({ input });

  const options = { model: 'text-davinci-003', max_tokens: 3000, temperature: 1, prompt: input };

  try {
    const response = await openai.createCompletion(options);

    return parseData(input, response);
  } catch (error) {
    return `Oops, ${error.response.data.error.message}`;
  }
}

function parseData(input, output) {
  let result = '';

  for (const { text } of output.data.choices) {
    result += text;
  }

  result = result.trim();

  if (result.includes('\n') && input.length < 5) {
    if (/\d/.test(result)) {
      result = 'tem certeza?';
    } else {
      result = `como assim ${input.toLowerCase()}?\n me explica melhor...`;
    }
  }

  console.log({ result });
  return result;
}
