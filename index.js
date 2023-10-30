const TelegramBot = require("node-telegram-bot-api");
const token = "6799068934:AAEKePtdW5awlfD_te9ldQvTg-0abTKmOX4";
const bot = new TelegramBot(token, { polling: true });
const apiHandler = require("./fetcher");
let isCityExist = false;
bot.setMyCommands([
  {
    command: "/start",
    description: "Botni qayta ishga tushurish",
  },
]);

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  const keyboard = {
    keyboard: [
      [
        { text: "Joylashuv orqali aniqlash", request_location: true },
        { text: "Shahar nomi bilan qidirish" },
      ],
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  };

  if (text == "/start") {
    bot.sendMessage(
      chatId,
      "Assalomu alaykum botga xush kelibsiz. Bu bot orqali siz ob havo malumotlariga ega bo'lasiz",
      {
        reply_markup: JSON.stringify(keyboard),
      }
    );
  } else if (text == "Shahar nomi bilan qidirish") {
    bot.sendMessage(
      chatId,
      "Yaxshi , qaysi shahar kerak bo'lsa shahar nomini to'g'ri holatda kiriting:"
    );
    isCityExist = true;
  } else if (isCityExist) {
    let cityName = text;
    getWeatherByCity(cityName)
      .then((data) => {
        bot.sendMessage(chatId, sendDetail(data));
      })
      .catch((error) => {
        bot.sendMessage(
          chatId,
          "Nimadir xato ketdi iltimos qaytadan urunib ko'ring :("
        );
        console.error(error);
      });
    isCityExist = false;
  }
});

bot.on("location", (msg) => {
  const latitude = msg.location.latitude;
  const longitude = msg.location.longitude;
  const chatId = msg.chat.id;

  getWeatherData(latitude, longitude)
    .then((data) => {
      bot.sendMessage(chatId, sendDetail(data));
    })
    .catch((error) => {
    //   bot.sendMessage(chatId,"Nimadir xato ketdi iltimos qaytadan urunib ko'ring :(");
      console.error(error);
    });
});

function sendDetail(data) {
  return `
      Shahar: ${data.name}
    🌡Temperatura: ${Math.floor(data.main.temp - 273.15)}C
    ✨His etilishi: ${Math.floor(data.main.feels_like - 273.15)}C
    🌏Atmosfera bosimi: ${data.main.pressure}
    💧Namlik: ${data.main.humidity}%
    🌃Osmon: ${
      data.weather[0].main == "Clouds" ? "Bulutli" : data.weather[0].main
    } 
    💨Shamol tezligi: ${data.wind.speed}km/soat
    ${data.visibility ? `Ko'rish masofasi: ${data.visibility} metr` : ""}
                   `;
}

async function getWeatherData(latitude, longitude) {
  const api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=ea7249aa34c40425b4bd2ba3de69d9e7`;

  try {
    const data = await apiHandler(api);
    return data;
  } catch (error) {
    throw error; // Rethrow the error to be handled by the caller.
  }
}
async function getWeatherByCity(cityName) {
  let api = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=ea7249aa34c40425b4bd2ba3de69d9e7`;

  try {
    const data = await apiHandler(api);
    return data;
  } catch (error) {
    throw error; // Rethrow the error to be handled by the caller.
  }
}
