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

// ==================== FAVORITTER ====================
function renderFavorites() {
  favoriteList.innerHTML = "";
  favorites.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.addEventListener("click", () => fetchWeather(city));
    favoriteList.appendChild(li);
  });
}

addFavoriteBtn.addEventListener("click", () => {
  const currentCity = cityName.textContent.split(",")[0];
  if (!favorites.includes(currentCity)) {
    favorites.push(currentCity);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
  }
});

// ==================== SØK ====================
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) {
    alert("Skriv inn en by!");
    return;
  }
  fetchWeather(city);
});

// ==================== HENT VÆR ====================
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

    // Dynamisk bakgrunn
    setBackground(data.weather[0].main);
  } catch (error) {
    alert(error.message);
    weatherResult.classList.add("hidden");
  }
}

// ==================== AI KLESRÅD ====================
function getClothingSuggestion(temp, weather) {
  let suggestion = "Vi anbefaler: ";
  if (temp < 5) suggestion += "tykk jakke, lue og hansker";
  else if (temp < 15) suggestion += "genser eller lett jakke";
  else if (temp < 25) suggestion += "t-skjorte og bukse/shorts";
  else suggestion += "lette klær og solbriller";

  if (weather.toLowerCase().includes("rain")) suggestion += ", ta med paraply eller regnjakke";

  return suggestion;
}

// ==================== HJELPEFUNKSJON ====================
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==================== DYNAMISK BAKGRUNN ====================
function setBackground(weather) {
  // Fjern gamle klasser og regndråper
  document.body.className = "";
  document.querySelectorAll(".rain-drop").forEach(e => e.remove());

  if (weather.toLowerCase().includes("cloud")) {
    document.body.classList.add("cloudy");
  } else if (weather.toLowerCase().includes("rain") || weather.toLowerCase().includes("drizzle")) {
    document.body.classList.add("rain");
    createRainAnimation();
  } else if (weather.toLowerCase().includes("snow")) {
    document.body.classList.add("snow");
  } else {
    document.body.classList.add("sunny");
  }
}

// ==================== REGN-ANIMASJON ====================
function createRainAnimation() {
  for (let i = 0; i < 50; i++) {
    const drop = document.createElement("div");
    drop.classList.add("rain-drop");
    drop.style.left = Math.random() * window.innerWidth + "px";
    drop.style.animationDuration = 0.5 + Math.random() * 0.5 + "s";
    drop.style.opacity = Math.random();
    document.body.appendChild(drop);
  }
}

// ==================== LAST INN FAVORITTER ====================
renderFavorites();
