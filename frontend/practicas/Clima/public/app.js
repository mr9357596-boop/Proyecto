// Configuración de la API
const API_KEY = 'b11746ba565ed07f530fe2534161873d'; // Tu API Key de OpenWeatherMap
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Elementos del DOM
const elements = {
    loader: document.getElementById('loader'),
    weatherCard: document.getElementById('weatherCard'),
    errorMessage: document.getElementById('errorMessage'),
    errorText: document.getElementById('errorText'),
    cityInput: document.getElementById('cityInput'),
    searchBtn: document.getElementById('searchBtn'),
    refreshBtn: document.getElementById('refreshBtn'),
    cityName: document.getElementById('cityName'),
    country: document.getElementById('country'),
    temp: document.getElementById('temp'),
    description: document.getElementById('description'),
    feelsLike: document.getElementById('feelsLike'),
        humidity: document.getElementById('humidity'),
    wind: document.getElementById('wind'),
    weatherIcon: document.getElementById('weatherIcon'),
    weatherEffects: document.getElementById('weatherEffects')
};

// Estado de la aplicación
let currentWeatherData = null;

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    // Intentar obtener ubicación automáticamente
    getWeatherByGeolocation();
    
    // Event listeners
    elements.searchBtn.addEventListener('click', searchByCity);
    elements.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchByCity();
    });
    elements.refreshBtn.addEventListener('click', refreshWeather);
});

// Obtener clima por geolocalización
function getWeatherByGeolocation() {
    if (!navigator.geolocation) {
        showError('Tu navegador no soporta geolocalización');
        return;
    }
    
    showLoader();
    
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherData(`lat=${latitude}&lon=${longitude}`);
        },
        error => {
            hideLoader();
            handleGeolocationError(error);
        }
    );
}

// Manejar errores de geolocalización
function handleGeolocationError(error) {
    let message = 'Error al obtener tu ubicación';
    
    switch(error.code) {
        case error.PERMISSION_DENIED:
            message = 'Permiso de ubicación denegado. Puedes buscar por ciudad.';
            break;
        case error.POSITION_UNAVAILABLE:
            message = 'Información de ubicación no disponible';
            break;
        case error.TIMEOUT:
            message = 'Tiempo de espera agotado al obtener ubicación';
            break;
    }
    
    showError(message);
}

// Buscar por ciudad
function searchByCity() {
    const city = elements.cityInput.value.trim();
    
    if (!city) {
        showError('Por favor ingresa el nombre de una ciudad');
        return;
    }
    
    showLoader();
    fetchWeatherData(`q=${city}`);
}

// Obtener datos del clima de la API
async function fetchWeatherData(queryParams) {
    try {
        const url = `${API_BASE_URL}?${queryParams}&appid=${API_KEY}&units=metric&lang=es`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(response.status === 404 ? 'Ciudad no encontrada' : 'Error al obtener datos');
        }
        
        const data = await response.json();
        currentWeatherData = data;
        displayWeatherData(data);
        
    } catch (error) {
        hideLoader();
        showError(error.message || 'Error de conexión. Verifica tu internet.');
    }
}

// Mostrar datos del clima
function displayWeatherData(data) {
    // Actualizar información en la tarjeta
    elements.cityName.textContent = data.name;
    elements.country.textContent = data.sys.country;
    elements.temp.textContent = Math.round(data.main.temp);
    elements.description.textContent = data.weather[0].description;
    elements.feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    elements.humidity.textContent = `${data.main.humidity}%`;
    elements.wind.textContent = `${data.wind.speed} m/s`;
    
    // Actualizar icono del clima
    const iconCode = data.weather[0].icon;
    elements.weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    elements.weatherIcon.alt = data.weather[0].description;
    
    // Cambiar tema según el clima
    updateWeatherTheme(data.weather[0].main);
    
    // Ocultar loader y mostrar tarjeta
    hideLoader();
    hideError();
    elements.weatherCard.classList.remove('hidden');
}

// Actualizar tema y efectos según el clima
function updateWeatherTheme(weatherMain) {
    // Limpiar clases anteriores
    document.body.className = '';
    clearWeatherEffects();
    
    switch(weatherMain.toLowerCase()) {
        case 'clear':
            document.body.classList.add('sunny');
            break;
        case 'clouds':
            document.body.classList.add('cloudy');
            break;
        case 'rain':
        case 'drizzle':
            document.body.classList.add('rainy');
            createRainEffect();
            break;
        case 'snow':
            document.body.classList.add('snowy');
            createSnowEffect();
            break;
        default:
            document.body.classList.add('cloudy');
    }
}

// Crear efecto de lluvia
function createRainEffect() {
    for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.classList.add('raindrop');
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
        elements.weatherEffects.appendChild(drop);
    }
}

// Crear efecto de nieve
function createSnowEffect() {
    const snowflakes = ['❄', '❅', '❆'];
    
    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
        snowflake.style.left = `${Math.random() * 100}%`;
        snowflake.style.animationDelay = `${Math.random() * 10}s`;
        snowflake.style.animationDuration = `${5 + Math.random() * 10}s`;
        snowflake.style.fontSize = `${0.8 + Math.random() * 1.2}rem`;
        elements.weatherEffects.appendChild(snowflake);
    }
}

// Limpiar efectos del clima
function clearWeatherEffects() {
    elements.weatherEffects.innerHTML = '';
}

// Actualizar clima
function refreshWeather() {
    if (currentWeatherData) {
        showLoader();
        fetchWeatherData(`q=${currentWeatherData.name}`);
    } else {
        getWeatherByGeolocation();
    }
}

// Funciones de utilidad para UI
function showLoader() {
    elements.loader.classList.remove('hidden');
    elements.weatherCard.classList.add('hidden');
    elements.errorMessage.classList.add('hidden');
}

function hideLoader() {
    elements.loader.classList.add('hidden');
}

function showError(message) {
    elements.errorText.textContent = message;
    elements.errorMessage.classList.remove('hidden');
    elements.weatherCard.classList.add('hidden');
}

function hideError() {
    elements.errorMessage.classList.add('hidden');
}