// The bot may be accessed at @secretMessageForNastya_bot

// importing modules (look helpers.js)
const {
  db,
  getRandomMessage,
  setCommands,
  sendStartMessage,
  sendCareMessage,
  sendWeather,
  sendInfoMessage,
  sendUsersMessage,
  getRandomMessageForNastya,
  sendFilmMessage,
} = require('./helpers');
const axios = require('axios')
const TelegramApi = require('node-telegram-bot-api');

const token = "tg-api-token";
const bot = new TelegramApi(token, { polling: true });

setCommands(bot)

bot.onText(/\/start/, (msg) => {
  sendStartMessage(bot, msg);
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

bot.onText(/\/users/, (msg) => {
  sendUsersMessage(bot, msg)
})

bot.onText(/\/film/, (msg) => {
  sendFilmMessage(bot, msg.chat.id)
  bot.sendMessage(msg.chat.id, '😴 Ця функція поки що в розробці і працює не так як потрібно 🥱')
})

bot.on('location', async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.chat.username || 'username_not_provided'
  const date = msg.date
  const { latitude, longitude } = msg.location;

  try {
    const isExists = await db.oneOrNone('SELECT * FROM user_data WHERE chat_id = $1', chatId);

    if (isExists == null) {
      console.log('Inserting:', chatId, username, date, longitude, latitude);
      await db.none('INSERT INTO user_data(chat_id, username, date, longitude, latitude) VALUES($1, $2, $3, $4, $5)', [chatId, username, date, longitude, latitude]);
    }

    await sendWeather(bot, chatId, latitude, longitude)
    await db.none('UPDATE user_data SET latitude = $1, longitude = $2 WHERE chat_id = $3', [latitude, longitude, chatId])

  } catch (error) {
    console.error('Error fetching data:', error.message);
    await bot.sendMessage(chatId, 'Sorry, something went wrong, contact Artur');
  }
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id
  const buttonData = query.data

  const tmdbKey = 'tmdb-token';
  const tmdbBaseUrl = 'https://api.themoviedb.org/3/';
  const discoverMovieEndpoint = 'discover/movie'
  const requestParams = `?api_key=${tmdbKey}&with_genre=${buttonData}`
  const urlToFetch = `${tmdbBaseUrl}${discoverMovieEndpoint}${requestParams}`

  if (buttonData == 'secret') {
    if (chatId === 606289979) {
      bot.sendMessage(chatId, getRandomMessageForNastya())
    } else {
      bot.sendMessage(chatId, getRandomMessage())
    }
  } else {
    bot.sendMessage(chatId, `Шукаю ${buttonData} для тебе...`)
    const response = await axios.get(urlToFetch)
      if (response.status === 200) {
        const movies = response.data.results
        const randomIndex = movies[Math.floor(Math.random() * movies.length)]
        const randomMovie = randomIndex.original_title
        bot.sendMessage(chatId, 'По цьому жанру я знайшов цей рандомний фільм: ' + randomMovie)
      }
  }
});

module.exports = bot;