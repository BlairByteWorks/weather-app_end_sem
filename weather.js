// --- Configuration ---
// Expanded list to cover more test cases for the "Geocoding" simulation
const CITY_COORDINATES = {
    "nairobi": { lat: -1.2864, lon: 36.8172 },
    "mombasa": { lat: -4.0435, lon: 39.6682 },
    "kisumu": { lat: -0.0917, lon: 34.7680 },
    "london": { lat: 51.5074, lon: -0.1278 },
    "new york": { lat: 40.7128, lon: -74.0060 },
    "tokyo": { lat: 35.6762, lon: 139.6503 },
    "dubai": { lat: 25.2048, lon: 55.2708 },
    "sydney": { lat: -33.8688, lon: 151.2093 }
};

// DOM Elements
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const loadingDiv = document.getElementById('loading');
const resultDiv = document.getElementById('weatherResult');
const errorDiv = document.getElementById('errorMsg');

// Output Elements
const cityNameEl = document.getElementById('cityName');
const tempEl = document.getElementById('temp');
const windEl = document.getElementById('wind');
const iconEl = document.getElementById('icon');

// --- Helper: Get Weather Icon ---
// Using higher quality icons for better visuals
const getWeatherIcon = (code) => {
    // 0: Clear sky
    if (code === 0) return "https://cdn-icons-png.flaticon.com/512/869/869869.png"; 
    // 1-3: Partly cloudy
    if (code <= 3) return "https://cdn-icons-png.flaticon.com/512/1163/1163624.png"; 
    // 45, 48: Fog
    if (code <= 48) return "https://cdn-icons-png.flaticon.com/512/4151/4151022.png"; 
    // 51-67: Rain
    if (code <= 67) return "https://cdn-icons-png.flaticon.com/512/1146/1146858.png"; 
    // 71-86: Snow
    if (code <= 86) return "https://cdn-icons-png.flaticon.com/512/2315/2315309.png"; 
    // 95-99: Thunderstorm
    return "https://cdn-icons-png.flaticon.com/512/1146/1146860.png"; 
};

// --- Core Function: Fetch Weather ---
async function fetchWeather() {
    // 1. Reset UI
    resultDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    
    const city = cityInput.value.trim().toLowerCase();

    // 2. Error Handling: Empty Input
    if (!city) {
        showError("⚠️ Please enter a city name.");
        return;
    }

    // 3. Error Handling: Invalid City (Mock Geocoding)
    const coords = CITY_COORDINATES[city];
    if (!coords) {
        showError(`🚫 City not found in database. Try: Nairobi, Mombasa, HomaBay, Nakuru...`);
        return;
    }

    // 4. Show Loading
    loadingDiv.classList.remove('hidden');

    try {
        // 5. Async Fetch
        // Artificial delay (500ms) so the user can actually see the loading spinner
        await new Promise(r => setTimeout(r, 500));

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`;
        
        const response = await fetch(url);

        // 6. Error Handling: API Error
        if (!response.ok) {
            throw new Error("Weather service is unavailable.");
        }

        const data = await response.json();

        // 7. Update DOM
        updateUI(city, data.current_weather);

    } catch (error) {
        // 8. Error Handling: Network Failure
        console.error(error);
        showError("❌ Network failure. Please check your internet connection.");
    } finally {
        loadingDiv.classList.add('hidden');
    }
}

// --- UI Update Function ---
function updateUI(city, weather) {
    cityNameEl.textContent = city.charAt(0).toUpperCase() + city.slice(1);
    tempEl.textContent = Math.round(weather.temperature); // Rounding for cleaner look
    windEl.textContent = weather.windspeed;
    
    iconEl.src = getWeatherIcon(weather.weathercode);
    iconEl.alt = `Weather condition code ${weather.weathercode}`;

    resultDiv.classList.remove('hidden');
}

// --- Error Display Function ---
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

// --- Event Listeners ---
searchBtn.addEventListener('click', fetchWeather);

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchWeather();
});