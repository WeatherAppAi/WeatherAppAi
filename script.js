const apiKey = "fea9d4df6ce4196562db128b257ac5cd";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

const weatherResult = document.getElementById("weatherResult");
const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const clothingAdvice = document.getElementById("clothingAdvice");
const addFavoriteBtn = document.getElementById("addFavoriteBtn");
const favoriteList = document.getElementById("favoriteList");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Vis favoritter
function renderFavorites() {
  favoriteList.innerHTML = "";
  favorites.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.addEventListener("click", () => fetchWeather(city));
    favoriteList.appendChild(li);
  });
}

// Legg til favoritt
addFavoriteBtn.addEventListener("click", () => {
  const currentCity = cityName.textContent.split(",")[0];
  if (!favorites.includes(currentCity)) {
    favorites.push(currentCity);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
  }
});

// Søk knapp
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) {
    alert("Skriv inn en by!");
    return;
  }
  fetchWeather(city);
});

// Hent vær
async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=no`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("By ikke funnet");
    const data = await response.json();

    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `Temperatur: ${data.main.temp}°C`;
    description.textContent = `Vær: ${capitalize(data.weather[0].description)}`;
    humidity.textContent = `Fuktighet: ${data.main.humidity}%`;
    wind.textContent = `Vind: ${data.wind.speed} m/s`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    clothingAdvice.textContent = getClothingSuggestion(data.main.temp, data.weather[0].main);

    weatherResult.classList.remove("hidden");
  } catch (error) {
    alert(error.message);
    weatherResult.classList.add("hidden");
  }
}

// AI-klesråd
function getClothingSuggestion(temp, weather) {
  let suggestion = "Vi anbefaler: ";
  if (temp < 5) suggestion += "tykk jakke, lue og hansker";
  else if (temp < 15) suggestion += "genser eller lett jakke";
  else if (temp < 25) suggestion += "t-skjorte og bukse/shorts";
  else suggestion += "lette klær og solbriller";

  if (weather.toLowerCase().includes("rain")) suggestion += ", ta med paraply eller regnjakke";

  return suggestion;
}

// Stor forbokstav
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Last inn favoritter ved start
renderFavorites();
