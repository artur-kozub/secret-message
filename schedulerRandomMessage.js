// this one needed to set up scheduled job on heroku server
const {
    getRandomMessage,
    getRandomMessageForNastya,
    db
} = require('./helpers');
const axios = require('axios');
const token = 'tg-api-token';

const sendScheduledMessage = async () => {
    const users = await db.manyOrNone('SELECT chat_id FROM user_data');
    const message = '🤓 Цитата дня:' + getRandomMessage()
    const messageForNastya = getRandomMessageForNastya()
    const endPoint = `https://api.telegram.org/bot${token}/sendMessage`

    for (const user of users) {

        if (user.chat_id == 606289979) {
            axios.post(endPoint, {
                chat_id: user.chat_id,
                text: messageForNastya,
            })
        } else {
            axios.post(endPoint, {
                chat_id: user.chat_id,
                text: message,
            })
        }

    }
    console.log('executing schedulerRandomMessage')
}

sendScheduledMessage();