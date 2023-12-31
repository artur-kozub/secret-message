// The bot may be accessed at @secretMessageForNastya_bot

const phrases = require("./helpers");
const TelegramApi = require("node-telegram-bot-api");
const heartEmoji = "\u2764\uFE0F";
const inLoveEmoji = "\u{1F60D}";
const token = "tg-bot-token";

// Create a bot
const bot = new TelegramApi(token, { polling: true });

// Generates a random message from array
const messageGenerator = (arr) => {
  const randInt = Math.floor(Math.random() * 20);

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
  const halfHour = 1800000;

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
    }, halfHour);
  } else if (text === "/info") {
    await bot.sendMessage(
      chatId,
      "Я створив цей бот для того щоб тобі не було сумно, якщо мене не буде поруч" +
      inLoveEmoji +
      "\n\nПоки що він реагує тільки коли ти надсилаєш повідомлення. Це може бути будь-що, навіть літера або картинка чи файл\nТакож після команди /start бот запускається і відправляє тобі повідомлення кожнші півгодини.\nАле ця відправка закінчиться, якщо ти напишеш що-небудь боту\nДля відновлення цієї розсилки, просто відправ команду /start боту і він почне слати знову",
    );
    setInterval(() => {
      const message = messageGenerator(phrases);
      bot.sendMessage(chatId, message);
    }, halfHour);
  } else {
    await bot.sendMessage(chatId, message);
  }
  console.log(msg);
});
