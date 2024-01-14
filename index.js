// The bot may be accessed at @secretMessageForNastya_bot

// importing modules (look helpers.js)
const { phrases, 
  getWeather, 
  getRandomMessage, 
  sendRandomMessage, 
  setCommands, 
  sendStartMessage, 
  scheduleJobs, 
  sendCareMessage, 
  sendWeather,
  sendInfoMessage, } = require('./helpers');

const TelegramApi = require('node-telegram-bot-api');
const schedule = require('node-schedule')
const pgp = require('pg-promise')()

const DATABASE_URL = 'your-db-url'
const db = pgp(DATABASE_URL)

const token = 'telegram-bot-token';
const bot = new TelegramApi(token, { polling: true });

setCommands(bot)

bot.onText(/\/start/, (msg) => {
  sendStartMessage(bot, msg);
  scheduleJobs(bot, msg.chat.id);
  console.log(msg);
});

bot.onText(/\/care/, (msg) => {
  sendCareMessage(bot, msg);
  console.log(msg);
});

bot.onText(/\/info/, (msg) => {
  sendInfoMessage(bot, msg);
  console.log(msg);
});

bot.on('location', async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.chat.username
  const date = msg.date
  const { latitude, longitude } = msg.location;

  try {
    const isExists = await db.oneOrNone('SELECT * FROM user_data WHERE username = $1', username);

    if (isExists == null) {
      await db.none('INSERT INTO user_data(chat_id, username, date, longitude, latitude) VALUES($1, $2, $3, $4, $5)', [chatId, username, date, longitude, latitude]);
    }

    await sendWeather(bot, chatId, latitude, longitude);

    schedule.scheduleJob({ hour: 8, minute: 0 }, async () => {
      const storedLocation = await db.oneOrNone('SELECT latitude, longitude FROM user_data WHERE username = $1', username);
      if (storedLocation) {
        const { latitude, longitude } = storedLocation;
        await sendWeather(bot, chatId, latitude, longitude);
      }
    });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    await bot.sendMessage(chatId, 'Sorry, something went wrong, contact Artur');
  }
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id
  bot.sendMessage(chatId, getRandomMessage())
});