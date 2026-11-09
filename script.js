
const searchInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const weatherCondition = document.getElementById("weatherCondition");
const weatherIcon = document.getElementById("weatherIcon");

const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const feelsLike = document.getElementById("feelsLike");

const message = document.getElementById("message");

// Weather code ko text aur icon mein convert karna
function getWeatherInfo(code) {
    if (code === 0) {
        return { text: "Clear Sky", icon: "☀️" };
    } 
    else if (code === 1 || code === 2) {
        return { text: "Partly Cloudy", icon: "🌤️" };
    } 
    else if (code === 3) {
        return { text: "Cloudy", icon: "☁️" };
    } 
    else if (code === 45 || code === 48) {
        return { text: "Foggy", icon: "🌫️" };
    } 
    else if (code >= 51 && code <= 57) {
        return { text: "Drizzle", icon: "🌦️" };
    } 
    else if (code >= 61 && code <= 67) {
        return { text: "Rainy", icon: "🌧️" };
    } 
    else if (code >= 71 && code <= 77) {
        return { text: "Snowy", icon: "❄️" };
    } 
    else if (code >= 80 && code <= 82) {
        return { text: "Rain Showers", icon: "🌧️" };
    } 
    else if (code >= 85 && code <= 86) {
        return { text: "Snow Showers", icon: "🌨️" };
    } 
    else if (code === 95 || code === 96 || code === 99) {
        return { text: "Thunderstorm", icon: "⛈️" };
    } 
    else {
        return { text: "Unknown Weather", icon: "🌍" };
    }
}

// City search karna
async function searchWeather() {
    const city = searchInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name!";
        return;
    }

    message.textContent = "Loading weather data...";

    searchBtn.disabled = true;

    try {
        // City ki location find karna
        const geoURL =
            "https://geocoding-api.open-meteo.com/v1/search?name=" +
            encodeURIComponent(city) +
            "&count=1&language=en&format=json";

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Location service unavailable.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found! Try another city.");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Current weather data lena
        const weatherURL =
            "https://api.open-meteo.com/v1/forecast?latitude=" +
            latitude +
            "&longitude=" +
            longitude +
            "&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timezone=auto";

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Weather service unavailable.");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        // Weather information
        const info = getWeatherInfo(current.weather_code);

        // Screen par data show karna
        cityName.textContent =
            location.name +
            (location.country ? ", " + location.country : "");

        temperature.textContent =
            Math.round(current.temperature_2m) + "°C";

        weatherCondition.textContent = info.text;

        weatherIcon.textContent = info.icon;

        humidity.textContent =
            current.relative_humidity_2m + "%";

        windSpeed.textContent =
            current.wind_speed_10m + " km/h";

        feelsLike.textContent =
            Math.round(current.apparent_temperature) + "°C";

        message.textContent = "Weather updated successfully!";

    } catch (error) {
        message.textContent = error.message;
    } finally {
        searchBtn.disabled = false;
    }
}

// Search button click
searchBtn.addEventListener("click", searchWeather);

// Enter key se search
searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchWeather();
    }
});

// Starting weather
searchInput.value = "Hyderabad";
searchWeather();
