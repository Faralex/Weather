class Utilities {
  static updateTime(currentTimeElement) {
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    currentTimeElement.textContent = timeNow;
  }

  static async triggerSearch(
    input,
    apiModule,
    uiModule,
    weatherIcons,
    elementsContainer,
    localStorageModule
  ) {
    const city = input.value.trim();

    if (city) {
      const isValidCity = await apiModule.loadWeather(
        city,
        uiModule,
        weatherIcons,
        elementsContainer
      );

      if (isValidCity) {
        localStorageModule.saveRecentCity(city);
      } else {
        alert("Город не найден.");
      }
    } else {
      alert("Введит название города.");
    }
  }

  static toggleActiveButton(activeButton, buttons) {
    buttons.forEach((button) => {
      button.classList.remove("active");
    });

    activeButton.classList.add("active");
  }
}

export default Utilities;
