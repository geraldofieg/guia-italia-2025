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
  const lang = document.documentElement.lang;
  const dayElements = document.querySelectorAll('.day');

  dayElements.forEach(day => {
    const forecastContainer = day.querySelector('.weather-forecast');
    const city = day.dataset.city;
    const date = day.dataset.date;

    if (city && date && forecastContainer) {
      getWeather(city, date, forecastContainer, lang);
    }
  });
});

async function getWeather(city, date, container, lang) {
  try {
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`City not found: ${city}`);
    }

    const { latitude, longitude } = geoData.results[0];

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Europe/Rome&start_date=${date}&end_date=${date}`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    if (!weatherData.daily) {
      throw new Error('Weather forecast not available.');
    }

    const { temperature_2m_max, temperature_2m_min, precipitation_sum, weather_code } = weatherData.daily;

    const maxTemp = Math.round(temperature_2m_max[0]);
    const minTemp = Math.round(temperature_2m_min[0]);
    const rain = precipitation_sum[0];
    const weatherCode = weather_code[0];

    const tempTitle = lang === 'pt-BR' ? 'Temperatura Máxima e Mínima' : (lang === 'it' ? 'Temperatura Massima e Minima' : 'Max and Min Temperature');
    const precipTitle = lang === 'pt-BR' ? 'Precipitação' : (lang === 'it' ? 'Precipitazione' : 'Precipitation');

    container.innerHTML = `
      <span title="${tempTitle}">${maxTemp}°C / ${minTemp}°C</span>
      <span title="${precipTitle}">${rain} mm</span>
      <span title="${getWeatherDescription(weatherCode, lang)}">${getWeatherIcon(weatherCode)}</span>
    `;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    const errorMsg = lang === 'pt-BR' ? 'Não foi possível carregar a previsão.' : (lang === 'it' ? 'Impossibile caricare le previsioni.' : 'Could not load forecast.');
    container.innerHTML = `<span class="error">${errorMsg}</span>`;
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

function getWeatherDescription(code, lang) {
    const descriptions = {
        'pt-BR': { 0: 'Céu limpo', 1: 'Predominantemente limpo', 2: 'Parcialmente nublado', 3: 'Nublado', 45: 'Nevoeiro', 48: 'Nevoeiro com geada', 51: 'Chuvisco leve', 53: 'Chuvisco moderado', 55: 'Chuvisco denso', 61: 'Chuva fraca', 63: 'Chuva moderada', 65: 'Chuva forte', 71: 'Neve fraca', 73: 'Neve moderada', 75: 'Neve forte', 80: 'Pancadas de chuva fracas', 81: 'Pancadas de chuva moderadas', 82: 'Pancadas de chuva violentas', 95: 'Trovoada', 96: 'Trovoada com granizo fraco', 99: 'Trovoada com granizo forte' },
        'en': { 0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast', 45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle', 61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain', 71: 'Slight snow fall', 73: 'Moderate snow fall', 75: 'Heavy snow fall', 80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers', 95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail' },
        'it': { 0: 'Cielo sereno', 1: 'Prevalentemente sereno', 2: 'Parzialmente nuvoloso', 3: 'Nuvoloso', 45: 'Nebbia', 48: 'Nebbia con brina', 51: 'Pioggerella leggera', 53: 'Pioggerella moderata', 55: 'Pioggerella fitta', 61: 'Pioggia debole', 63: 'Pioggia moderata', 65: 'Pioggia forte', 71: 'Nevicata debole', 73: 'Nevicata moderata', 75: 'Nevicata forte', 80: 'Rovescio di pioggia debole', 81: 'Rovescio di pioggia moderato', 82: 'Rovescio di pioggia violento', 95: 'Temporale', 96: 'Temporale con grandine debole', 99: 'Temporale con grandine forte' }
    };
    const langKey = lang.startsWith('pt') ? 'pt-BR' : (lang === 'it' ? 'it' : 'en');
    return (descriptions[langKey] && descriptions[langKey][code]) || descriptions['en'][code] || 'Unknown';
}
