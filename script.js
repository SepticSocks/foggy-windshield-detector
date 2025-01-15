// Replace with your real API key from WeatherAPI.com
const API_KEY = 628d0506b1a74ac3a7d24459251501;

document.getElementById('checkWeather').addEventListener('click', async () => {
  const location = document.getElementById('locationInput').value.trim();
  if (!location) {
    alert("Please enter a city or ZIP code.");
    return;
  }

  try {
    const weatherData = await getWeatherData(location);

    // WeatherAPI's "current.json" returns an object with `current` containing temp_c, humidity, etc.
    const tempC = weatherData.current.temp_c;
    const humidity = weatherData.current.humidity;

    // Simple logic for fog/frost:
    // - If temp < 2°C & humidity > 80 => "Likely Frost!"
    // - Else if 2°C <= temp < 10°C & humidity > 80 => "Likely Fog!"
    // - Else => "No Fog/Frost expected."
    let resultMessage = "No Fog/Frost expected.";

    if (tempC < 2 && humidity > 80) {
      resultMessage = "Likely Frost!";
    } else if (tempC >= 2 && tempC < 10 && humidity > 80) {
      resultMessage = "Likely Fog!";
    }

    document.getElementById('result').textContent = 
      `${resultMessage} (Temp: ${tempC}°C, Humidity: ${humidity}%)`;

  } catch (error) {
    console.error(error);
    document.getElementById('result').textContent = "Error fetching weather data.";
  }
});

async function getWeatherData(location) {
  // WeatherAPI endpoint for current weather:
  // https://api.weatherapi.com/v1/current.json?key=YOUR_KEY&q=LOCATION
  const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Could not fetch weather data from WeatherAPI.");
  }
  return response.json();
}
