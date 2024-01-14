const axios = require('axios')
const schedule = require('node-schedule')

const phrases = [
    'Ти найкрасивіша жінка на світі',
    'Твоя посмішка розганяє всі печалі',
    'Я завжди почуваюся щасливим, коли бачу тебе.',
    'Ти моя найбільша підтримка і натхнення.',
    'Твоя енергія завжди робить мій день яскравішим.',
    'Я не можу уявити своє життя без тебе.',
    'Ти моє сонячне проміння.',
    'Кожен момент з тобою - неперевершений.',
    'Ти маєш неймовірну силу та витримку.',
    'Ти можеш досягнути будь-які цілі, які собі поставиш.',
    'Ти надихаєш мене бути кращою людиною.',
    'Твій голос - мелодія, яку я хочу слухати постійно.',
    'Твоя усмішка - це моє багатство.',
    'Думки про тебе розсіюють всі мої негативні думки.',
    'Ти моє щастя та радість.',
    'Твоя любов - це найцінніший подарунок у моєму житті.',
    'Ти моя суперзірка, яка ніколи не згасне.',
    'Я завжди тут для тебе, незалежно від того, що станеться.',
    'Ти дуже сильна, і я вірю, що зможеш подолати будь-які труднощі.',
    'В тобі є безмежна краса, яку не можна описати словами.',
    'Ти найкраще, що сталося у моєму житті.',
    'Твоя посмішка освітлює мій день.',
    'Ти неймовірно красива сьогодні.',
    'Ти дуже розумна та талановита.',
    'Ти моє натхнення.',
    'Ти така сильна та впевнена.',
    'Твоя любов робить мене кращим.',
    'З тобою час пролітає неймовірно швидко.',
    'Ти - моє щастя.',
    'Я завжди буду підтримувати тебе.',
    'Ти неймовірно талановита в тому, що робиш.',
    'Ти така мила, як кішечка.',
    'Я не уявляю свого життя без тебе.',
    'Ти - моє сонце, що освітлює мій світ.',
    'Ти - найкраща подруга, яку можна мати.',
    'Ти завжди здатна на досягнення неймовірних речей.',
    'Ти дуже важлива для мене.',
    'Твоя усмішка робить мене щасливим.',
    'Я безмежно горджусь тобою.',
    'Ти - моя неповторна принцеса.',
    'Ти - моє втілення мрій.',
    'Ти дивовижна та надзвичайна.',
    'З тобою я відчуваю себе неперевершеним.',
    'Ти - найважливіша особа у моєму житті.',
    'Твоя любов - найкращий подарунок для мене.',
    'Ти - джерело мого щастя.',
    'Ти - дивовижне створіння з неперевершеною красою.',
    'Ти - моє небо, що наповнюється зірками.',
    'Ти просто чарівна.',
    'Ти - моє все.',
    'Твоя присутність дарує мені спокій.',
    'Ти - найкраща річ, що сталася у моєму житті.',
    'Ти - моє найбільше щастя.',
    'Я завжди буду поруч з тобою, незалежно від усього.',
    'Ти - моє світло в темряві.',
    'Ти - моя мрія, що стала реальністю.',
    'Ти - неперевершений приклад для інших.',
    'Ти - моя надія та віра.',
    'Ти - моя скарбниця радості.',
    'Ти - моє улюблене диво.',
    'Ти - моє щастя, моя радість.',
    'Ти - джерело моєї сили.',
    'Ти - моє все, що я бажаю.',
    'Твої слова завжди надихають мене.',
    'Ти - моє найбільше багатство.',
    'Ти - моя незмінна опора та підтримка.',
    'Ти - моє безмежне щастя.',
    'Твоя любов - найкраще, що можна мати.',
    'Ти - моя доля, що змінила моє життя.',
    'Ти - моя надія на краще майбутнє.',
    'Ти - моя мелодія, що звучить у серці.',
    'Ти - моє незабутня пригода.',
    'Ти - моє кохання, що розцвітає кожен день.',
    'Я завжди буду тут для тебе.',
    'Ти - моя вся сутність, моє все.'
];

const getWeather = async (latitude, longitude) => {
    const apiKey = 'your-weatherapi-token'
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
  
      if (weatherData.weather && weatherData.weather[0] && weatherData.weather[0].description) {
        const kelvin = weatherData.main.temp
        const celsius = Math.floor(kelvin - 273.15)
        if (celsius <= 5) {
          const weatherMessage = `Сьогодні холодно ${celsius}°C, одягайся тепліше`
          return weatherMessage
        } else if (celsius > 5 && celsius <= 12) {
          const weatherMessage = `Прохолодно ${celsius}°C`
          return weatherMessage
        } else if (celsius > 12 && celsius <= 24) {
          const weatherMessage = `Сьогодні комфортна погода ${celsius}°C`
          return weatherMessage
        } else {
          const weatherMessage = `Спека ${celsius}°C`
          return weatherMessage
        }
      } else {
        console.error('Unexpected weather data structure:', weatherData);
        return 'Sorry, I couldn\'t fetch the weather at the moment.';
      }
    } catch (error) {
      console.error('Error fetching data:', error.message)
      return 'Sorry I was unable to fetch data'
    }
  }

  const getRandomMessage = () => {
    return phrases[Math.floor(Math.random() * phrases.length)]
  }

  const sendRandomMessage = (bot, chatId) => {
    bot.sendMessage(chatId, getRandomMessage())
  }

  const setCommands = (bot) => {
    bot.setMyCommands([
      { command: "/start", description: "Для початку" },
      { command: "/care", description: "Турбота" },
      { command: "/info", description: "Інфо"},
    ])
  }

  const sendStartMessage = (bot, msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name;
    const startMessage = `Привіт ${firstName}! Я твій бот. Натискай`;
  
    bot.sendMessage(chatId, startMessage, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Секретне послання', callback_data: '1' }
          ],
        ],
      },
    });
  };

  const sendCareMessage = (bot, msg) => {
    const chatId = msg.chat.id;
    const opts = {
      reply_markup: JSON.stringify({
        keyboard: [
          [{ text: 'Allow Location', request_location: true }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      }),
    };
    bot.sendMessage(chatId, 'Відправ свою локацію', opts);
  };

  const sendInfoMessage = (bot, msg) => {
    const chatId = msg.chat.id;
    const infoMessage = '/start - бот надсилає раз на день і кнопка секрет\n/care - бот запитує геолокацію і надсилає погоду кожного ранку'
    bot.sendMessage(chatId, infoMessage);
  };

  const scheduleJobs = (bot, chatId) => {
    const job = schedule.scheduleJob({ hour: 12, minute: 0 }, () => {
      sendRandomMessage(bot, chatId);
    });
  
    const jobForTesting = schedule.scheduleJob('* * * * *', () => {
      console.log('Job ran at:', new Date());
    });
  };

  const sendWeather = async (bot, chatId, latitude, longitude) => {
    try {
      const weatherMessage = await getWeather(latitude, longitude);
      await bot.sendMessage(chatId, weatherMessage);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      await bot.sendMessage(chatId, 'Sorry, something went wrong, contact Artur');
    }
  };

module.exports = {
    phrases,
    getWeather,
    getRandomMessage,
    sendRandomMessage,
    setCommands,
    sendStartMessage,
    scheduleJobs,
    sendCareMessage,
    sendWeather,
    sendInfoMessage,
}