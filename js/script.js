import APImodule from "./APImodule.js";
import LocalStorageModule from "./localStorageModule.js";
import UIModule from "./UImodule.js";
import Utilities from "./utilities.js";

const apiUrl = import.meta.env.VITE_API_URL;
const forecastApiUrl = import.meta.env.VITE_FORECAST_API_URL;
const locationIqApiUrl = import.meta.env.VITE_LOCATION_IQ_API_URL;
const apiToken = import.meta.env.VITE_API_TOKEN;

const DOM = {
  currentTime: document.querySelector(".header__logo-time"),
  input: document.querySelector(".input"),
  inputIcon: document.querySelector(".elements__input-icon"),
  suggestionsList: document.querySelector(".elements__input-suggestions"),
  todayButton: document.querySelector(".header__navigation-link"),
  tomorrowButton: document.querySelectorAll(".header__navigation-link")[1],
  threeDaysButton: document.querySelector(".threeDays-btn"),
  footerContainer: document.querySelector(".footer__container"),
  elementsContainer: document.querySelector(".elements__container"),
};

const buttons = [DOM.todayButton, DOM.tomorrowButton, DOM.threeDaysButton];

let showTomorrowWeather = false;
let showThreeDaysWeather = false;
let weatherData = null;

const apiModule = new APImodule(apiUrl, forecastApiUrl, locationIqApiUrl, apiToken);
const localStorageModule = new LocalStorageModule(loadWeather, DOM.input);
const uiModule = new UIModule();

const weatherIcons = {
  Clear: "./img/Sunny.png",
  Clouds: "./img/Cloud.png",
  Rain: "./img/Rain.png",
  Snow: "./img/Snow.png",
  Thunderstorm: "./img/ThunderStorm.png",
  Drizzle: "./img/Rain.png",
  Mist: "./img/Mist.png",
  Fog: "./img/Mist.png",
};

Utilities.updateTime(DOM.currentTime);
setInterval(() => Utilities.updateTime(DOM.currentTime), 60000);

async function loadWeather(city) {
  const forecastData = await apiModule.loadWeather(
    city,
    uiModule,
    weatherIcons,
    DOM.elementsContainer
  );
  if (forecastData) {
    weatherData = forecastData;
    localStorageModule.saveRecentCity(city);

    DOM.footerContainer.style.display = "flex";

    const data = weatherData.list.slice(0, 8);
    uiModule.processThreeDayForecastData({
      data,
      weatherIcons,
      footerContainer: DOM.footerContainer,
    });
    return true;
  } else {
    alert("Город не найден. Пожалуйста, попробуйте ввести правильное название.");
    return false;
  }
}

DOM.input.addEventListener("input", async () => {
  const query = DOM.input.value.trim();
  await apiModule.fetchCities(query, DOM.suggestionsList);
  if (query) {
    try {
      const cities = await apiModule.fetchCities(query, DOM.suggestionsList);
      if (cities.length > 0) {
        uiModule.displaySuggestions(
          cities,
          DOM.suggestionsList,
          DOM.input,
          loadWeather,
          localStorageModule
        );
      } else {
        DOM.suggestionsList.style.display = "none";
      }
    } catch (error) {
      console.error("Error fetching city data:", error);
      DOM.suggestionsList.style.display = "none";
    }
  } else {
    DOM.suggestionsList.style.display = "none";
  }
});

DOM.input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    Utilities.triggerSearch(
      DOM.input,
      apiModule,
      uiModule,
      weatherIcons,
      DOM.elementsContainer,
      localStorageModule
    );
  }
});

DOM.inputIcon.addEventListener("click", function (event) {
  Utilities.triggerSearch(
    DOM.input,
    apiModule,
    uiModule,
    weatherIcons,
    DOM.elementsContainer,
    localStorageModule
  );
});

DOM.todayButton.addEventListener("click", () => {
  showTomorrowWeather = false;
  showThreeDaysWeather = false;

  Utilities.toggleActiveButton(DOM.todayButton, buttons);
  const weatherBlock = document.querySelector(".elements__weather");
  if (weatherBlock) {
    weatherBlock.style.display = "block";
  }
  if (weatherData) {
    const data = weatherData.list.slice(0, 8);
    uiModule.processThreeDayForecastData({
      data,
      weatherIcons,
      footerContainer: DOM.footerContainer,
    });
  }
});

DOM.tomorrowButton.addEventListener("click", () => {
  showTomorrowWeather = true;
  showThreeDaysWeather = false;

  Utilities.toggleActiveButton(DOM.tomorrowButton, buttons);

  const weatherBlock = document.querySelector(".elements__weather");
  if (weatherBlock) {
    weatherBlock.style.display = "none";
  }

  if (weatherData) {
    uiModule.processForecastData({
      data: weatherData,
      weatherIcons,
      footerContainer: DOM.footerContainer,
      showTomorrowWeather,
      showThreeDaysWeather,
    });
  }
});

DOM.threeDaysButton.addEventListener("click", () => {
  showTomorrowWeather = false;
  showThreeDaysWeather = true;

  Utilities.toggleActiveButton(DOM.threeDaysButton, buttons);

  const weatherBlock = document.querySelector(".elements__weather");
  if (weatherBlock) {
    weatherBlock.style.display = "none";
  }

  if (weatherData) {
    const threeDaysForecastData = weatherData.list.slice(2, 26);
    uiModule.processThreeDayForecastData({
      data: threeDaysForecastData,
      weatherIcons,
      footerContainer: DOM.footerContainer,
      showFullDate: true,
    });
  }
});

localStorageModule.loadRecentCities();
