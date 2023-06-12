import Papa from "papaparse";

fetch("city_coordinates.csv")
  .then((res) => res.text())
  .then((res) => {
    appendCitySelect(Papa.parse(res).data);
  });

function appendCitySelect(list) {
  const select = document.querySelector("#city-select");

  for (let i = 1; i < list.length; i++) {
    const option = document.createElement("option");
    option.textContent = `${list[i][2]}, ${list[i][3]}`;
    option.value = `${list[i][0]}:${list[i][1]}`;
    select.append(option);
  }

  select.addEventListener("change", getWeatherData);
}

function getWeatherData(event) {
  const coords = event.target.value;
  const [latitude, longtitude] = coords.split(":");

  fetch(
    `https://www.7timer.info/bin/civillight.php?lon=${longtitude}&lat=${latitude}&ac=0&unit=metric&output=json&tzshift=0`
  )
    .then((res) => res.json())
    .then((res) => displayWeather(res.dataseries, [latitude, longtitude]))
    .catch((err) => console.log(err));
}

function displayWeather(data, location) {
  const weatherContainer = document.querySelector("#weather-container");
  weatherContainer.replaceChildren();

  const weatherTitle = document.querySelector("#location");
  const selectedOption = document.querySelector(`[value="${location.join(":")}"]`);
  weatherTitle.textContent = `Weather forecast for ${selectedOption.textContent}`;

  for (let i in data) {
    weatherContainer.append(createWeatherCard(data[i]));
  }
}

function createWeatherCard(data) {
  const card = document.createElement("div");
  card.classList.add("card");

  const cardTitle = document.createElement("h3");
  cardTitle.textContent = data.weather;

  const cardImage = document.createElement("img");
  cardImage.src = `../images/${data.weather}.svg`;
  cardImage.alt = data.weather;

  const cardTemperature = document.createElement("div");
  const maxContainer = document.createElement("div");
  const minContainer = document.createElement("div");

  const maxTemperatureLabel = document.createElement("p");
  const minTemperatureLabel = document.createElement("p");
  maxTemperatureLabel.textContent = "MAX Temp";
  minTemperatureLabel.textContent = "MIN Temp";

  const maxTemperature = document.createElement("p");
  const minTemperature = document.createElement("p");
  maxTemperature.textContent = `${data.temp2m.max} °C`;
  minTemperature.textContent = `${data.temp2m.min} °C`;

  cardTemperature.classList.add("card-temperature");
  maxContainer.classList.add("temp-container");
  minContainer.classList.add("temp-container");
  maxTemperatureLabel.classList.add("temp-label");
  minTemperatureLabel.classList.add("temp-label");
  maxTemperature.classList.add("max-temp");
  minTemperature.classList.add("min-temp");

  maxContainer.append(maxTemperatureLabel, maxTemperature);
  minContainer.append(minTemperatureLabel, minTemperature);
  cardTemperature.append(minContainer, maxContainer);

  card.append(cardTitle, cardImage, cardTemperature);

  return card;
}
