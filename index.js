// The bot may be accessed at @secretMessageForNastya_bot

const phrases = require("./helpers");
const TelegramApi = require("node-telegram-bot-api");
const heartEmoji = "\u2764\uFE0F";
const inLoveEmoji = "\u{1F60D}";
const token = "6877742053:AAFlDwXpoJiiuCL_tUpiCEqKFzQN9FHVqyM";

// Server for deployment
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("I am the bot server :)");
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
};

// Setting start and info commands for bot
bot.setMyCommands([
  { command: "/start", description: "Для початку" },
  { command: "/info", description: "Інформація про бот" },
]);

// Handling bot logic, messages sending etc.
bot.on("message", async (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;
  const message = messageGenerator(phrases);
  const hour = 3600000;

  if (text === "/start") {
    await bot.sendSticker(
      chatId,
      "https://chpic.su/_data/stickers/c/Cats_stikeru7777/Cats_stikeru7777_008.webp?v=1703065210",
    );
    await bot.sendMessage(
      chatId,
      `Привіт, Настя ${heartEmoji}, напиши мені будь що ${inLoveEmoji}\nЯкщо ти нічого мені не напишеш, то я буду відправляти тобі повідомлення кожну годину`,
    );
    // This one starts when bot receives /start command and sends random message every hour
    setInterval(() => {
      const message = messageGenerator(phrases);
      bot.sendMessage(chatId, message);
    }, hour);
  } else if (text === "/info") {
    await bot.sendMessage(
      chatId,
      "Я створив цей бот для того щоб тобі не було сумно, якщо мене не буде поруч" +
      inLoveEmoji +
      "\n\nПоки що він реагує тільки коли ти надсилаєш повідомлення. Це може бути будь-що, навіть літера або картинка чи файл\nТакож після команди /start бот запускається і відправляє тобі повідомлення кожну годину.\nАле ця відправка закінчиться, якщо ти напишеш що-небудь боту\nДля відновлення цієї розсилки, просто відправ команду /start боту і він почне слати повідомлення кожну годину",
    );
  } else {
    await bot.sendMessage(chatId, message);
  }
  console.log(msg);
});