const axios = require('axios')
// importing arrays with phrases/quotes needed
const phrases = require('./src/phrases')
const quotes = require('./src/quotes')
// emodjis package
const emoji = require('node-emoji')
// for env variables
require('dotenv').config()
// for postgres
const pgp = require('pg-promise')()
const DATABASE_URL = process.env.DATABASE_URL
const db = pgp(DATABASE_URL)

// function to handle weather requests
const getWeather = async (latitude, longitude) => {
  const apiKey = process.env.OPEN_WEATHER_KEY
  const apiUrl = 'https://api.openweathermap.org/data/2.5/weather'

  try {
    const response = await axios.get(apiUrl, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: apiKey
      }
    })
    const weatherData = response.data

    // converting received kelvin to celsius
    const kelvin = weatherData.main.temp
    const celsius = Math.floor(kelvin - 273.15)

    // logic for message in accordance to temperature
    if (celsius <= 3) {
      const weatherMessage = `🥶 Бррр! Сьогодні холодно - ${celsius}°C одягайся тепліше`
      return weatherMessage
    } else if (celsius > 3 && celsius <= 12) {
      const weatherMessage = `🆒 Прохолодно - ${celsius}°C. Бажано продумати свій аутфіт 👘`
      return weatherMessage
    } else if (celsius > 12 && celsius <= 24) {
      const weatherMessage = `😎 Сьогодні комфортна погода - ${celsius}°C`
      return weatherMessage
    } else {
      const weatherMessage = `🥵 Уф! Спека - ${celsius}°C`
      return weatherMessage
    }
  } catch (error) {
    console.error('Error fetching data:', error.message)
    return 'Sorry I was unable to fetch data'
  }
}

// random message for all users
const getRandomMessage = () => {
  const emojis = [' 🤔', ' 🧠', ' 😉', ' 😎', ' 🌞', ' 🙂', ' 🤩', ' 🦦', ' ✨', ' 🎲', ' 🎨']
  return quotes[Math.floor(Math.random() * quotes.length)] + emojis[Math.floor(Math.random() * emojis.length)]
}

// random message for one particular user
const getRandomMessageForNastya = () => {
  const emojis = [' 💖', ' ✨', ' 🥹', ' 🥰', ' 🌞', ' 🫶🏼', ' 😘', ' 😍', ' 💓']
  return phrases[Math.floor(Math.random() * phrases.length)] + emojis[Math.floor(Math.random() * emojis.length)]
}

// commands setupper
const setCommands = (bot) => {
  bot.setMyCommands([
    { command: "/start", description: "Для початку" },
    { command: "/film", description: "Пошук фільму" },
    { command: "/care", description: "Турбота" },
    { command: "/info", description: "Інфо" },
    { command: "/users", description: "Користувачі" },
  ])
}

// sends total amount of users
const sendUsersMessage = async (bot, msg) => {
  const chatId = msg.chat.id
  const usersAmount = await db.many('SELECT COUNT(*) FROM user_data')
  const emojiUser = emoji.get(':man_technologist:')
  bot.sendMessage(chatId, `${emojiUser} Наразі бот має таку кількість користувачів: "${usersAmount[0].count}"`)
}

// sends message at /start command
const sendStartMessage = (bot, msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name;
  const loveEmoji = emoji.get('heart')
  const secretEmoji = emoji.get('love_letter')
  const startMessageNastya = `${loveEmoji} Привіт ${firstName}! Я твій бот. Натискай`
  const startMessage = `👋 Привіт ${firstName}! Я твій бот. Натискай`

  if (chatId === 606289979) {
    bot.sendMessage(chatId, startMessageNastya, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: secretEmoji + 'Секретне послання', callback_data: 'secret' }
          ],
        ],
      },
    })
  } else {
    bot.sendMessage(chatId, startMessage, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🧐 Секретне послання', callback_data: 'secret' }
          ],
        ],
      },
    })
  }
}

// location and weather handler
const sendCareMessage = (bot, msg) => {
  const chatId = msg.chat.id;
  const compassEmoji = emoji.get('compass')
  const earthEmoji = emoji.get('earth_americas')
  const opts = {
    reply_markup: JSON.stringify({
      keyboard: [
        [{ text: compassEmoji + 'Відправити локацію', request_location: true }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    }),
  };
  bot.sendMessage(chatId, earthEmoji + 'Відправ свою локацію', opts)
}

// /info command handler
const sendInfoMessage = (bot, msg) => {
  const chatId = msg.chat.id;
  const infoMessage =
    `🚀 /start - надсилає послання раз на день і кнопка секрет

🌍 /care - запитує геолокацію і надсилає погоду кожного ранку

👥 /users - надсилає актуальне число користувачів бота

🎞️ /film - шукає постер, назву і опис фільму (англійською)`
  bot.sendMessage(chatId, infoMessage)
};

// final weather sender
const sendWeather = async (bot, chatId, latitude, longitude) => {
  try {
    const weatherMessage = await getWeather(latitude, longitude)
    await bot.sendMessage(chatId, weatherMessage)
  } catch (error) {
    console.error(`Error sending weather message to ${chatId}:`, error.message)

    if (error.response && error.response.status === 403) {
      console.log(`User ${chatId} has blocked the bot. Handle accordingly.`);
    } else {
      await bot.sendMessage(chatId, 'Sorry, something went wrong. Please contact support.');
    }
  }
};

// for /film command
const sendFilmMessage = (bot, chatId) => {
  const genreKeyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            {text: 'Екшн', callback_data: 'Action'},
            {text: 'Пригоди', callback_data: 'Adventure'},
            {text: 'Анімований', callback_data: 'Animation'},            
          ],
          [
            {text: 'Комедія', callback_data: 'Comedy'},
            {text: 'Кримінал', callback_data: 'Crime'},
            {text: 'Документалка', callback_data: 'Documentary'},            
          ],
          [
            {text: 'Драма', callback_data: 'Drama'},
            {text: 'Сімейний', callback_data: 'Family'},
            {text: 'Фентезі', callback_data: 'Fantasy'},            
          ],
          [
            {text: 'Історичний', callback_data: 'History'},
            {text: 'Хорор', callback_data: 'Horror'},
            {text: 'Мюзикл', callback_data: 'Music'},            
          ],
          [
            {text: 'Таємниця', callback_data: 'Mystery'},
            {text: 'Романтика', callback_data: 'Romance'},
            {text: 'Наукова Фантастика', callback_data: 'Science fiction'},            
          ],
          [
            {text: 'Трилер', callback_data: 'Thriller'},
            {text: 'Військовий', callback_data: 'War'},
            {text: 'Вестерн', callback_data: 'Western'},            
          ],
        ] 
  }
}
  bot.sendMessage(chatId, '🔍 Пошук фільму, обери жанр:', genreKeyboard)
}

// exporting modules
module.exports = {
  db,
  sendUsersMessage,
  getWeather,
  getRandomMessage,
  setCommands,
  sendStartMessage,
  sendCareMessage,
  sendWeather,
  sendInfoMessage,
  getRandomMessageForNastya,
  sendFilmMessage,
}