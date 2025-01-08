class APImodule {
  constructor(apiUrl, forecastApiUrl, locationIqApiUrl, apiToken) {
    this.apiUrl = apiUrl;
    this.forecastApiUrl = forecastApiUrl;
    this.locationIqApiUrl = locationIqApiUrl;
    this.apiToken = apiToken;
  }

  async fetchCities(query, suggestionsList) {
    if (query.length < 3) {
      suggestionsList.style.display = "none";
      return [];
    }

    try {
      const response = await fetch(
        `${this.locationIqApiUrl}?key=${this.apiToken}&q=${query}&format=json&limit=5`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.length > 0) {
        suggestionsList.style.display = "block";

        const formattedCities = data.map((place) => {
          const displayNameParts = place.display_name.split(", ");

          const city = displayNameParts[0];
          const country = displayNameParts[displayNameParts.length - 1];

          return { city, country };
        });

        return formattedCities;
      } else {
        suggestionsList.style.display = "none";
        return [];
      }
    } catch (error) {
      return [];
    }
  }

  async fetchForecastData(lat, lon) {
    try {
      const forecastUrl = `${this.forecastApiUrl}&lat=${lat}&lon=${lon}`;
      const response = await fetch(forecastUrl);
      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        console.log("Failed to fetch forecast", data);
        return null;
      }
    } catch (error) {
      console.log("Error", error);
      return null;
    }
  }

  async loadWeather(city, uiModule, weatherIcons, elementsContainer) {
    try {
      const apiCity = `${this.apiUrl}&q=${city}&lang=ru`;
      const response = await fetch(apiCity);
      const responseResult = await response.json();

      if (response.ok && responseResult && responseResult.name && responseResult.weather) {
        uiModule.getWeather(responseResult, weatherIcons, elementsContainer);
        const lat = responseResult.coord.lat;
        const lon = responseResult.coord.lon;

        const forecastData = await this.fetchForecastData(lat, lon);
        if (forecastData) {
          return forecastData;
        }
      } else {
        console.log("not found:", city);
        return null;
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }
}

export default APImodule;
