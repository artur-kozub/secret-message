// this one needed to set up scheduled job on heroku server

const { db, getWeather } = require('../helpers')
const axios = require('axios')
require('dotenv').config()
const token = process.env.BOT_TOKEN

const schedulerWeather = async () => {
  const endPoint = `https://api.telegram.org/bot${token}/sendMessage`

  db.manyOrNone('SELECT DISTINCT chat_id, latitude, longitude FROM user_data')
    .then((users) => {
      users.forEach(async (user) => {
        const { chat_id, latitude, longitude } = user
        const message = await getWeather(latitude, longitude)
        axios.post(endPoint, {
          chat_id: chat_id,
          text: message,
        })
        console.log('executing schedulerWeather')
      });
    })
    .catch((error) => {
      console.error('Error retrieving users:', error.message)
    })
}

schedulerWeather()