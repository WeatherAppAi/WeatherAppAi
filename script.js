const apiKey = "DIN_API_KEY_HER"; // Bytt ut med din OpenWeatherMap API-nøkkel

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

// Søk-knapp
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

// Hent værdata
async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=no`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("By ikke funnet");
    const data = await response.json();
    
    // Vis værdata
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `Temperatur: ${data.main.temp}°C`;
    description.textContent = `Vær: ${data.weather[0].description}`;
    humidity.textContent = `Fuktighet: ${data.main.humidity}%`;
    wind.textContent = `Vind: ${data.wind.speed} m/s`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    // AI-klesråd
    clothingAdvice.textContent = getClothingSuggestion(data.main.temp, data.weather[0].main);

    weatherResult.classList.remove("hidden");
  } catch (error) {
    alert(error.message);
    weatherResult.classList.add("hidden");
  }
}

// Enkel AI-klesrådgiver
function getClothingSuggestion(temp, weather) {
  let suggestion = "Vi anbefaler: ";

  if (temp < 5) suggestion += "tykk jakke, lue og hansker";
  else if (temp < 15) suggestion += "genser eller lett jakke";
  else if (temp < 25) suggestion += "t-skjorte og bukse/shorts";
  else suggestion += "lette klær og solbriller";

  if (weather.toLowerCase().includes("rain")) suggestion += ", ta med paraply eller regnjakke";

  return suggestion;
}

