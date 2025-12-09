const CITY_COORDINATES = {
    "nairobi": { lat: -1.2864, lon: 36.8172 },
    "london": { lat: 51.5074, lon: -0.1278 },
    "new york": { lat: 40.7128, lon: -74.0060 },
    "tokyo": { lat: 35.6762, lon: 139.6503 },
    "mombasa": { lat: -4.0435, lon: 39.6682 },
    "kisumu": { lat: -0.0917, lon: 34.7680 },
    "nakuru": { lat: -0.3031, lon: 36.0800 }
};

const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const loadingDiv = document.getElementById('loading');
const resultDiv = document.getElementById('weatherResult');
const errorDiv = document.getElementById('errorMsg');
const cityNameEl = document.getElementById('cityName');
const tempEl = document.getElementById('temp');
const windEl = document.getElementById('wind');
const iconEl = document.getElementById('icon');

const getWeatherIcon = (code) => {
    if (code <= 3) return "https://cdn-icons-png.flaticon.com/512/869/869869.png";
    if (code <= 48) return "https://cdn-icons-png.flaticon.com/512/1146/1146869.png";
    if (code <= 67) return "https://cdn-icons-png.flaticon.com/512/1146/1146858.png";
    return "https://cdn-icons-png.flaticon.com/512/1146/1146860.png";
};

async function fetchWeather() {
    resultDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    
    const city = cityInput.value.trim().toLowerCase();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    const coords = CITY_COORDINATES[city];
    if (!coords) {
        showError(`City not found. Try: Nairobi, London, Mombasa, Kisumu...`);
        return;
    }

    loadingDiv.classList.remove('hidden');

    try {
        await new Promise(r => setTimeout(r, 500)); // Artificial delay for UX
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`;
        const response = await fetch(url);

        if (!response.ok) throw new Error("Weather service is unavailable.");

        const data = await response.json();
        updateUI(city, data.current_weather);

    } catch (error) {
        console.error(error);
        showError("Network failure. Please check your internet connection.");
    } finally {
        loadingDiv.classList.add('hidden');
    }
}

function updateUI(city, weather) {
    cityNameEl.textContent = city.charAt(0).toUpperCase() + city.slice(1);
    tempEl.textContent = Math.round(weather.temperature);
    windEl.textContent = weather.windspeed;
    iconEl.src = getWeatherIcon(weather.weathercode);
    iconEl.alt = `Weather code ${weather.weathercode}`;
    resultDiv.classList.remove('hidden');
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

searchBtn.addEventListener('click', fetchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchWeather();
});