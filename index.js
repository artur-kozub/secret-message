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
} = require('./helpers')

require('dotenv').config()
const axios = require('axios')
const TelegramApi = require('node-telegram-bot-api')
const token = process.env.BOT_TOKEN

const bot = new TelegramApi(token, { polling: true })

setCommands(bot)

bot.onText(/\/start/, (msg) => {
  sendStartMessage(bot, msg)
})

bot.onText(/\/care/, (msg) => {
  sendCareMessage(bot, msg)
})

bot.onText(/\/info/, (msg) => {
  sendInfoMessage(bot, msg)
})

bot.onText(/\/users/, (msg) => {
  sendUsersMessage(bot, msg)
})

bot.onText(/\/film/, (msg) => {
  sendFilmMessage(bot, msg.chat.id)
})

bot.on('location', async (msg) => {
  const chatId = msg.chat.id
  const username = msg.chat.username || 'username_not_provided'
  const date = msg.date
  const { latitude, longitude } = msg.location

  try {
    const isExists = await db.oneOrNone('SELECT * FROM user_data WHERE chat_id = $1', chatId)

    if (isExists == null) {
      console.log('Inserting:', chatId, username, date, longitude, latitude)
      await db.none('INSERT INTO user_data(chat_id, username, date, longitude, latitude) VALUES($1, $2, $3, $4, $5)', [chatId, username, date, longitude, latitude])
    }

    await sendWeather(bot, chatId, latitude, longitude)
    await db.none('UPDATE user_data SET latitude = $1, longitude = $2 WHERE chat_id = $3', [latitude, longitude, chatId])

  } catch (error) {
    console.error('Error fetching data:', error.message);
    await bot.sendMessage(chatId, 'Sorry, something went wrong, contact Artur')
  }
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id
  const buttonData = query.data

  const genresIdMap = {
    'Action': 28,
    'Adventure': 12,
    'Animation': 16,
    'Comedy': 35,
    'Crime': 80,
    'Documentary': 99,
    'Drama': 18,
    'Family': 10751,
    'Fantasy': 14,
    'History': 36,
    'Horror': 27,
    'Music': 10402,
    'Mystery': 9648,
    'Romance': 10749,
    'Science Fiction': 878,
    'Thriller': 53,
    'War': 10752,
    'Western': 37
  }

  const genreId = genresIdMap[buttonData]

  const tmdbKey = process.env.TMDB_KEY
  const tmdbBaseUrl = 'https://api.themoviedb.org/3/'
  const discoverMovieEndpoint = 'discover/movie'
  const requestParams = `?api_key=${tmdbKey}&with_genres=${genreId}`
  const urlToFetch = `${tmdbBaseUrl}${discoverMovieEndpoint}${requestParams}`

  if (buttonData == 'secret') {
    if (chatId == 606289979) {
      bot.sendMessage(chatId, getRandomMessageForNastya())
    } else {
      bot.sendMessage(chatId, getRandomMessage())
    }
  } else {
    try {
      const response = await axios.get(urlToFetch)
      const movies = response.data.results
      
      if (movies.length > 0) {
        const randomIndex = Math.floor(Math.random() * movies.length)
        const randomMovie = movies[randomIndex]

        const posterPath = randomMovie.poster_path
        const moviePosterUrl = `https://image.tmdb.org/t/p/original/${posterPath}`
        const overview = randomMovie.overview
        const filmTitle = randomMovie.original_title
        if (filmTitle != 'Гранит') {
          bot.sendPhoto(chatId, moviePosterUrl, {
            caption: `📜 Title: ${filmTitle}\n\n📹 Overview: ${overview}`,
            parse_mode: 'Markdown'
          })
        }
      } else {
        bot.sendMessage(chatId, 'Не знайдено фільмів за цим жанром.')
      }
    } catch (error) {
      console.error('Error fetching movies:', error.message)
    }
  }
})
