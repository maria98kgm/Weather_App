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

  const defaultOption = document.querySelector("#default-option");
  defaultOption.disabled = true;
}

function displayWeather(data, location) {
  const weatherContainer = document.querySelector("#weather-container");
  weatherContainer.replaceChildren();

  const weatherTitle = document.querySelector("#location");
  const selectedOption = document.querySelector(`[value="${location.join(":")}"]`);
  weatherTitle.textContent = `Weather forecast for ${selectedOption.textContent}`;

  for (let i in data) {
    weatherContainer.append(createWeatherCard(data[i], +i));
  }
}

function createWeatherCard(data, count) {
  const card = document.createElement("div");
  card.classList.add("card");

  const cardTitle = document.createElement("h3");
  cardTitle.textContent = getWeatherName(data.weather);
  cardTitle.classList.add("card-title");

  const date = new Date();
  date.setDate(date.getDate() + count);
  const cardDate = document.createElement("p");
  cardDate.textContent = formatDate(date);
  cardDate.classList.add("card-date");

  const cardImage = document.createElement("img");
  cardImage.src = `../images/${data.weather === "humid" ? "fog" : data.weather}.svg`;
  cardImage.alt = data.weather;
  cardImage.classList.add("weather-icon");

  const cardTemperature = document.createElement("div");
  const maxContainer = document.createElement("div");
  const minContainer = document.createElement("div");

  const maxTemperatureLabel = document.createElement("p");
  const minTemperatureLabel = document.createElement("p");
  maxTemperatureLabel.textContent = "MAX";
  minTemperatureLabel.textContent = "MIN";

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

  card.append(cardTitle, cardDate, cardImage, cardTemperature);

  let clicked = false;
  card.addEventListener("click", () => {
    clicked = !clicked;
    if (clicked) card.classList.add("active");
    else card.classList.remove("active");
  });

  return card;
}

function formatDate(date) {
  const options = { weekday: "short", year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-us", options);
}

function getWeatherName(shortName) {
  switch (shortName) {
    case "ishower":
      return "Isolated shower";
    case "lightrain":
      return "light rain";
    case "lightsnow":
      return "light snow";
    case "mcloudy":
      return "cloudy";
    case "pcloudy":
      return "partly cloudy";
    case "oshower":
      return "occasional shower";
    case "rainsnow":
      return "mixed";
    case "tstorm":
      return "thunderstorm possible";
    case "tsrain":
      return "thunderstorm";
    default:
      return shortName;
  }
}
