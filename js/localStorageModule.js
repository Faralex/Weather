class LocalStorageModule {
  constructor(loadWeatherFn, inputElement) {
    if (typeof loadWeatherFn === "function") {
      this.loadWeather = loadWeatherFn;
    } else {
      throw new Error("loadWeatherFn is not a function");
    }

    this.input = inputElement;

    this.recentCitiesLabel = document.querySelector(".elements__input-recent");
  }

  saveRecentCity(city) {
    let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];

    if (!recentCities.includes(city)) {
      recentCities.unshift(city);
    }

    if (recentCities.length > 3) {
      recentCities.pop();
    }

    localStorage.setItem("recentCities", JSON.stringify(recentCities));
    this.loadRecentCities();
  }

  loadRecentCities() {
    const recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
    this.recentCitiesLabel.innerHTML = "";

    if (recentCities.length > 0) {
      this.recentCitiesLabel.textContent = "Недавние города: ";

      recentCities.forEach((city, index) => {
        const cityLink = document.createElement("span");
        cityLink.textContent = city;
        cityLink.classList.add("recent-city");

        cityLink.addEventListener("click", () => {
          this.loadWeather(city);
          this.input.value = city;
        });

        this.recentCitiesLabel.appendChild(cityLink);

        if (index < recentCities.length - 1) {
          this.recentCitiesLabel.appendChild(document.createTextNode(", "));
        }
      });
    } else {
      this.recentCitiesLabel.textContent = "Недавние города: Нет данных";
    }
  }
}

export default LocalStorageModule;
