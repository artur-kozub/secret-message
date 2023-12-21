const phrases = require('./helper')
const TelegramApi = require('node-telegram-bot-api')
const heartEmoji = '\u2764\uFE0F';
const token = 'your-bot-token'

const bot = new TelegramApi(token, { polling: true })

const messageGenerator = (arr) => {
    const randInt = Math.floor(Math.random() * 20)

    return arr[randInt];
}

bot.on('message', msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const message = messageGenerator(phrases);
    if (text === '/start') {
        bot.sendMessage(chatId, `Привіт, Настя ${heartEmoji}, напиши мені будь що :)`)
    } else {bot.sendMessage(chatId, message);}
    console.log(msg);
});