// ---------------------------
// DIN OPENWEATHERMAP API NØKKEL
// ---------------------------
const apiKey = "fea9d4df6ce4196562db128b257ac5cd";

// ---------------------------
// HTML ELEMENTER
// ---------------------------
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

// ---------------------------
// SØK KNAPP
// ---------------------------
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) {
    alert("Skriv inn en by!");
    return;
  }
  fetchWeather(city);
});

// ---------------------------
// FUNKSJON FOR Å HENTE VÆR
// ---------------------------
async function fetchWeather(city) {
  // Tillater at brukeren skriver by, eller by,land
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=no`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("By ikke funnet");

    const data = await response.json();

    // ---------------------------
    // VIS VÆRDATA
    // ---------------------------
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `Temperatur: ${data.main.temp}°C`;
    description.textContent = `Vær: ${capitalize(data.weather[0].description)}`;
    humidity.textContent = `Fuktighet: ${data.main.humidity}%`;
    wind.textContent = `Vind: ${data.wind.speed} m/s`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    // ---------------------------
    // AI-KLESRÅDGIVER
    // ---------------------------
    clothingAdvice.textContent = getClothingSuggestion(data.main.temp, data.weather[0].main);

    weatherResult.classList.remove("hidden");
  } catch (error) {
    alert(error.message);
    weatherResult.classList.add("hidden");
  }
}

// ---------------------------
// FUNKSJON: AI-KLESRÅD
// ---------------------------
function getClothingSuggestion(temp, weather) {
  let suggestion = "Vi anbefaler: ";

  if (temp < 5) suggestion += "tykk jakke, lue og hansker";
  else if (temp < 15) suggestion += "genser eller lett jakke";
  else if (temp < 25) suggestion += "t-skjorte og bukse/shorts";
  else suggestion += "lette klær og solbriller";

  if (weather.toLowerCase().includes("rain")) suggestion += ", ta med paraply eller regnjakke";

  return suggestion;
}

// ---------------------------
// HJELPEFUNKSJON: Stor forbokstav
// ---------------------------
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
