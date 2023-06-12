import Papa from "papaparse";

fetch("city_coordinates.csv")
  .then((res) => res.text())
  .then((res) => {
    appendCitySelect(Papa.parse(res).data);
  });

function appendCitySelect(list) {
  const select = document.createElement("select");

  for (let i = 1; i < list.length; i++) {
    const option = document.createElement("option");
    option.textContent = `${list[i][2]}, ${list[i][3]}`;
    option.value = `${list[i][0]}:${list[i][1]}`;
    select.append(option);
  }

  select.addEventListener("change", displayWeather);
  document.getElementById("main-content").append(select);
}

function displayWeather(event) {
  const coords = event.target.value;
  console.log(coords);
}
