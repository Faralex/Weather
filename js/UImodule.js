class UIModule {
  renderBlock(data, weatherIcons) {
    const city = data.name;
    const temp = Math.round(data.main.temp);
    const weatherCondition = data.weather[0].main;
    const weatherIcon = weatherIcons[weatherCondition];

    return `
      <div class="elements__weather-city">
          <h2>${city}</h2>
          <img src="./img/location.svg" alt="">
      </div>
      <div class="elements__weather-temp">
          <img src="./img/temp.svg" alt="">
          <h2 class="elements__weather-text">${temp}&#8451;</h2>
          <img class="weatherIcon" src="${weatherIcon}" alt="${weatherCondition}">
      </div>
      <p class="elements__weather-date">${new Date().toLocaleDateString("ru", {
        month: "short",
        day: "numeric",
        weekday: "short",
      })}</p>
      <div class="elements__weather-details">
          <ul class="elements__weather-ul">
              <li class="elements__weather-item">Ветер: <span class="elements__weather-link value">${
                data.wind.speed
              } м/с</span></li>
              <li class="elements__weather-item">Влажность: <span class="elements__weather-link value">${
                data.main.humidity
              }%</span></li>
              <li class="elements__weather-item">Давление: <span class="elements__weather-link value">${this.convertPressure(
                data.main.pressure
              )} мм рт. ст.</span></li>
          </ul>
      </div>
    `;
  }

  convertPressure(pressureInHpa) {
    const pressureInMmHg = pressureInHpa * 0.7501;
    return Math.round(pressureInMmHg);
  }

  displaySuggestions(cities, suggestionsList, input, loadWeather, localStorageModule) {
    suggestionsList.innerHTML = "";
    const uniqueCities = new Set();

    cities.forEach((place) => {
      const cityAndCountry = `${place.city}, ${place.country}`;

      if (!uniqueCities.has(cityAndCountry)) {
        uniqueCities.add(cityAndCountry);

        const suggestionItem = document.createElement("li");
        suggestionItem.textContent = cityAndCountry;

        suggestionItem.addEventListener("click", async () => {
          input.value = cityAndCountry;
          const isValidCity = await loadWeather(place.city);
          if (isValidCity) {
            localStorageModule.saveRecentCity(place.city);
          } else {
            alert("City not found.");
          }
          suggestionsList.style.display = "none";
        });

        suggestionsList.appendChild(suggestionItem);
      }
    });

    suggestionsList.style.display = uniqueCities.size ? "block" : "none";
  }

  getWeather(data, weatherIcons, elementsContainer) {
    let weatherBlock = document.querySelector(".elements__weather");

    if (!weatherBlock) {
      weatherBlock = document.createElement("div");
      weatherBlock.classList.add("elements__weather");
      elementsContainer.appendChild(weatherBlock);
    }

    weatherBlock.innerHTML = this.renderBlock(data, weatherIcons);
  }

  processForecastData({
    data,
    weatherIcons,
    footerContainer,
    showTomorrowWeather = false,
    showThreeDaysWeather = false,
  }) {
    if (!data || !Array.isArray(data.list)) {
      console.error("Invalid data:", data);
      return;
    }

    footerContainer.innerHTML = "";

    let forecastData = showTomorrowWeather ? data.list.slice(8, 16) : data.list.slice(0, 8);

    if (showThreeDaysWeather) {
      forecastData = data.list.slice(0, 24);
    }

    forecastData.forEach((forecast) => {
      const time = new Date(forecast.dt * 1000);
      const timeFormatted = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const temp = Math.round(forecast.main.temp);
      const weatherCondition = forecast.weather[0].main;
      const weatherIcon = weatherIcons[weatherCondition];

      const footerItem = document.createElement("div");
      footerItem.classList.add("footer__info");

      footerItem.innerHTML = `
        <p class="footer__info-time">${timeFormatted}</p>
        <img class="footer__info-img" src="${weatherIcon}" alt="${weatherCondition}">
        <p class="footer__info-temp">${temp}&#8451;</p>
      `;

      footerContainer.appendChild(footerItem);
    });
  }

  processThreeDayForecastData({ data, weatherIcons, footerContainer, showFullDate = false }) {
    if (!data || !Array.isArray(data)) {
      console.error("Invalid data:", data);
      return;
    }

    footerContainer.innerHTML = "";

    data.forEach((forecast) => {
      const time = new Date(forecast.dt * 1000);
      const timeFormatted = showFullDate
        ? `${time.toLocaleDateString("ru", {
            day: "numeric",
            month: "short",
          })}, ${time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
        : time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const temp = Math.round(forecast.main.temp);
      const weatherCondition = forecast.weather[0].main;
      const weatherIcon = weatherIcons[weatherCondition];

      const footerItem = document.createElement("div");
      footerItem.classList.add("footer__info");

      footerItem.innerHTML = `
        <p class="footer__info-time">${timeFormatted}</p>
        <img class="footer__info-img" src="${weatherIcon}" alt="${weatherCondition}">
        <p class="footer__info-temp">${temp}&#8451;</p>
      `;

      footerContainer.appendChild(footerItem);
    });
  }
}

export default UIModule;
