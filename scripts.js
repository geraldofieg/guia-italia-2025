// Mostrar ou esconder o botão conforme o scroll
window.onscroll = function() {
  var btn = document.getElementById("btn-topo");
  if (document.body.scrollTop > 120 || document.documentElement.scrollTop > 120) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
};

// Função para rolar para o topo suavemente
document.getElementById("btn-topo").onclick = function() {
  window.scrollTo({top: 0, behavior: 'smooth'});
};

// --- Weather Forecast Feature ---

document.addEventListener('DOMContentLoaded', () => {
  const dayElements = document.querySelectorAll('.day');

  dayElements.forEach(day => {
    const forecastContainer = day.querySelector('.weather-forecast');
    const city = day.dataset.city;
    const date = day.dataset.date;

    if (city && date && forecastContainer) {
      getWeather(city, date, forecastContainer);
    }
  });
});

async function getWeather(city, date, container) {
  try {
    // Step 1: Get coordinates from city name
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`Cidade não encontrada: ${city}`);
    }

    const { latitude, longitude } = geoData.results[0];

    // Step 2: Get weather forecast from coordinates
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Europe/Rome&start_date=${date}&end_date=${date}`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    if (!weatherData.daily) {
      throw new Error('Previsão do tempo não disponível.');
    }

    // Step 3: Display weather data
    const { temperature_2m_max, temperature_2m_min, precipitation_sum, weather_code } = weatherData.daily;

    const maxTemp = Math.round(temperature_2m_max[0]);
    const minTemp = Math.round(temperature_2m_min[0]);
    const rain = precipitation_sum[0];
    const weatherCode = weather_code[0];

    container.innerHTML = `
      <span title="Temperatura Máxima e Mínima">${maxTemp}°C / ${minTemp}°C</span>
      <span title="Precipitação">${rain} mm</span>
      <span title="${getWeatherDescription(weatherCode)}">${getWeatherIcon(weatherCode)}</span>
    `;
  } catch (error) {
    console.error('Erro ao buscar previsão do tempo:', error);
    container.innerHTML = `<span class="error">Não foi possível carregar a previsão do tempo.</span>`;
  }
}

function getWeatherIcon(code) {
    if (code >= 95) return '⛈️'; // Thunderstorm
    if (code >= 80) return '🌧️'; // Rain showers
    if (code >= 71) return '🌨️'; // Snow
    if (code >= 61) return '💧'; // Rain
    if (code >= 51) return '💧'; // Drizzle
    if (code >= 45) return '🌫️'; // Fog
    if (code > 1) return '☁️';   // Cloudy
    if (code === 1) return '🌥️'; // Mainly clear
    return '☀️'; // Clear sky
}

function getWeatherDescription(code) {
    const descriptions = {
        0: 'Céu limpo',
        1: 'Predominantemente limpo',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Nevoeiro',
        48: 'Nevoeiro com deposição de geada',
        51: 'Chuvisco leve',
        53: 'Chuvisco moderado',
        55: 'Chuvisco denso',
        61: 'Chuva fraca',
        63: 'Chuva moderada',
        65: 'Chuva forte',
        71: 'Neve fraca',
        73: 'Neve moderada',
        75: 'Neve forte',
        80: 'Pancadas de chuva fracas',
        81: 'Pancadas de chuva moderadas',
        82: 'Pancadas de chuva violentas',
        95: 'Trovoada',
        96: 'Trovoada com granizo fraco',
        99: 'Trovoada com granizo forte'
    };
    return descriptions[code] || 'Condição desconhecida';
}
