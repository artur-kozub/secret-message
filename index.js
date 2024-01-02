// The bot may be accessed at @secretMessageForNastya_bot

const phrases = require('./helpers');
const TelegramApi = require('node-telegram-bot-api');
const heartEmoji = '\u2764\uFE0F';
const inLoveEmoji = '\u{1F60D}';
const token = 'telegram-api-token';

// Server for deployment
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('I am the bot server :)');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Create a bot
const bot = new TelegramApi(token, { polling: true });

// Generates a random message from array
const messageGenerator = (arr) => {
    const randInt = Math.floor(Math.random() * arr.length);

    return arr[randInt];
}

// Setting start and info commands for bot
bot.setMyCommands([
    { command: '/start', description: 'Для початку' },
    { command: '/info', description: 'Інформація про бот' },
]);

// Handling bot logic, messages sending etc.
bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const message = messageGenerator(phrases);
    if (text === '/start') {
        await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/c/Cats_stikeru7777/Cats_stikeru7777_008.webp?v=1703065210')
        await bot.sendMessage(chatId, `Привіт, Настя ${heartEmoji}, напиши мені будь що ${inLoveEmoji}`)
    } else if (text === '/info') {await bot.sendMessage(chatId,'Я створив цей бот для того щоб тобі не було сумно, якщо мене не буде поруч' + inLoveEmoji + '\n\nПоки що він реагує тільки коли ти надсилаєш повідомлення. Це може бути будь-що, навіть літера або картинка чи файл')} 
    else { await bot.sendMessage(chatId, message); }
    console.log(msg);
});
