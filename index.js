const phrases = require('./helper')
const TelegramApi = require('node-telegram-bot-api')
const heartEmoji = '\u2764\uFE0F';
const inLoveEmoji = '\u{1F60D}'
const token = 'telegram-bot-token'

const bot = new TelegramApi(token, { polling: true })

const messageGenerator = (arr) => {
    const randInt = Math.floor(Math.random() * 20)

    return arr[randInt];
}

bot.setMyCommands([
    { command: '/start', description: 'Для початку' },
    { command: '/info', description: 'Інформація про бот' },
])

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const message = messageGenerator(phrases);
    if (text === '/start') {
        await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/c/Cats_stikeru7777/Cats_stikeru7777_008.webp?v=1703065210')
        await bot.sendMessage(chatId, `Привіт, Настя ${heartEmoji}, напиши мені будь що ${inLoveEmoji}`)
    } else if (text === '/info') {await bot.sendMessage(chatId,'Я створив цей бот для того щоб тобі не було сумно, якщо мене не буде поруч' + inLoveEmoji + 'поки що він реагує тільки коли ти надсилаєш повідомлення, це може будь-що, навіть літера або картинка чи файл')} 
    else { await bot.sendMessage(chatId, message); }
    console.log(msg);
});