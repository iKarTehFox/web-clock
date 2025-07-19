import { match } from 'ts-pattern';
import OpenWeatherMap from 'openweathermap-ts';
import { menu, panel, weather } from './dom-elements';
import { getFirstElement } from './dom-selectors';
import { logConsole, showToast } from './dom-utils';
import { CurrentResponse } from 'openweathermap-ts/dist/types';
import i18next from 'i18next';

// Constants
const WEATHER_UPDATE_INTERVAL = 900000; // 15 minutes in milliseconds
const DEGREES_PER_DIRECTION = 22.5;
const DIRECTION_COUNT = 16;

// Types
type WeatherUnits = 'imperial' | 'metric';
type WeatherIconCode = '01d' | '01n' | '02d' | '02n' | '03d' | '03n' | '04d' | '04n' | 
                      '09d' | '09n' | '10d' | '10n' | '11d' | '11n' | '13d' | '13n' | '50d' | '50n';

interface WeatherSettings {
    key: string;
    lat: number;
    lon: number;
    units: WeatherUnits;
}

interface GeolocationCoordinates {
    latitude: number;
    longitude: number;
}

// State
let weatherInterval: NodeJS.Timeout;
let isWeatherMoving = false;

// Weather icon mapping
const WEATHER_ICON_MAP: Record<WeatherIconCode, string> = {
    '01d': 'bi bi-sun fs-4',           // clear sky (day)
    '01n': 'bi bi-moon fs-4',          // clear sky (night)
    '02d': 'bi bi-cloud-sun fs-4',     // few clouds (day)
    '02n': 'bi bi-cloud-moon fs-4',    // few clouds (night)
    '03d': 'bi bi-cloud fs-4',         // scattered clouds
    '03n': 'bi bi-cloud fs-4',         // scattered clouds
    '04d': 'bi bi-clouds fs-4',        // broken clouds
    '04n': 'bi bi-clouds fs-4',        // broken clouds
    '09d': 'bi bi-cloud-drizzle fs-4', // shower rain
    '09n': 'bi bi-cloud-drizzle fs-4', // shower rain
    '10d': 'bi bi-cloud-rain-heavy fs-4', // rain
    '10n': 'bi bi-cloud-rain-heavy fs-4', // rain
    '11d': 'bi bi-cloud-lightning fs-4',  // thunderstorm
    '11n': 'bi bi-cloud-lightning fs-4',  // thunderstorm
    '13d': 'bi bi-snow fs-4',          // snow
    '13n': 'bi bi-snow fs-4',          // snow
    '50d': 'bi bi-cloud-fog fs-4',     // mist
    '50n': 'bi bi-cloud-fog fs-4'      // mist
};

// Wind direction mapping
const WIND_DIRECTIONS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'] as const;

// Utility functions
function isValidLatitude(lat: number): boolean {
    return lat >= -90 && lat <= 90;
}

function isValidLongitude(lon: number): boolean {
    return lon >= -180 && lon <= 180;
}

function isValidWeatherUnits(units: string): units is WeatherUnits {
    return units === 'imperial' || units === 'metric';
}

function getTemperatureUnit(units: WeatherUnits): string {
    return units === 'imperial' ? i18next.t('weather.fahrenheit') : i18next.t('weather.celsius');
}

function getWindUnit(units: WeatherUnits): string {
    return units === 'imperial' ? i18next.t('weather.mph') : i18next.t('weather.ms');
}

function degreeToDirection(degrees: number): string {
    const index = Math.round(degrees / DEGREES_PER_DIRECTION) % DIRECTION_COUNT;
    return i18next.t(`weather.${WIND_DIRECTIONS[index]}`);
}

function getWeatherIcon(iconCode: string): string {
    return WEATHER_ICON_MAP[iconCode as WeatherIconCode] || 'bi bi-cloud fs-4';
}

// Geolocation function
export function getLocation(): Promise<GeolocationCoordinates> {
    if (!navigator.geolocation) {
        const errorMessage = i18next.t('toasts.weatherutils.gpsunsupported');
        showToast(i18next.t('toasts.weather.title'), errorMessage, 'long', 'danger');
        throw new Error('Geolocation is not supported by this browser.');
    }

    return new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                const errorMessage = i18next.t('toasts.weatherutils.gpserror', { 0: error });
                showToast(i18next.t('toasts.weather.title'), errorMessage, 'default', 'danger');
                reject(error);
            },
            { enableHighAccuracy: true }
        );
    });
}

// Weather API functions
async function fetchWeatherData(settings: WeatherSettings): Promise<CurrentResponse> {
    const owm = new OpenWeatherMap({
        apiKey: settings.key,
        units: settings.units,
        language: i18next.language
    });

    try {
        return await owm.getCurrentWeatherByGeoCoordinates(settings.lat, settings.lon);
    } catch (error) {
        logConsole(`Failed fetching weather data: ${error}`, 'error');
        throw error;
    }
}

function updateWeatherDisplay(data: CurrentResponse, units: WeatherUnits): void {
    const tempUnit = getTemperatureUnit(units);
    const windUnit = getWindUnit(units);

    // Update weather widget elements
    weather.name.innerText = `${data.name}, ${data.sys.country}`;
    weather.temp.innerText = `${data.main.temp}°${tempUnit}`;
    weather.feelslike.innerText = `${data.main.feels_like}°${tempUnit}`;
    weather.mintemp.innerText = `${data.main.temp_min}°${tempUnit}`;
    weather.maxtemp.innerText = `${data.main.temp_max}°${tempUnit}`;
    weather.wind.innerText = `${data.wind.speed} ${windUnit} ${degreeToDirection(data.wind.deg)}`;
    weather.condition.innerText = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);

    // Update weather icon
    logConsole(`Received weather icon code: ${data.weather[0].icon}`, 'info');
    weather.icon.className = getWeatherIcon(data.weather[0].icon);

    // Show weather widget
    weather.container.classList.remove('d-none');
}

function toggleWeatherMenuState(disabled: boolean): void {
    const elements = [
        menu.weatherapiinput,
        menu.weatherlatinput,
        menu.weatherloninput,
        menu.weathergeobtn,
        menu.weathersubmitbtn
    ];

    elements.forEach(element => {
        element.disabled = disabled;
    });

    menu.weatherunitradio.forEach(radio => {
        radio.disabled = disabled;
    });

    // Toggle move controls (opposite state)
    menu.weathermovetoggle.disabled = !disabled;
    menu.weathermovereset.disabled = !disabled;
    menu.weatherstopbtn.disabled = !disabled;
}

function parseWeatherSettingsFromForm(): WeatherSettings | null {
    const key = menu.weatherapiinput.value.trim();
    const latValue = menu.weatherlatinput.value.trim();
    const lonValue = menu.weatherloninput.value.trim();

    if (!key || !latValue || !lonValue) {
        logConsole('Not all weather settings were provided.', 'info');
        return null;
    }

    const lat = parseFloat(latValue);
    const lon = parseFloat(lonValue);
    const unitsElement = getFirstElement<HTMLInputElement>('input[name="weather-unit-radio"]:checked');
    const units = unitsElement?.id;

    if (!isValidLatitude(lat) || !isValidLongitude(lon)) {
        logConsole('Invalid latitude or longitude.', 'error');
        return null;
    }

    if (!units || !isValidWeatherUnits(units)) {
        logConsole('Invalid weather units selected.', 'error');
        return null;
    }

    return { key, lat, lon, units };
}

async function handleWeatherUpdate(settings: WeatherSettings): Promise<void> {
    try {
        const weatherData = await fetchWeatherData(settings);
        
        if (weatherData.cod === 200) {
            updateWeatherDisplay(weatherData, settings.units);
            logConsole('Weather data updated successfully.', 'info');
        } else {
            throw new Error(`Weather API returned code: ${weatherData.cod}`);
        }
    } catch (error) {
        stopWeather();
        logConsole(`Failed while handling weather data: ${error}`, 'error');
        showToast(i18next.t('toasts.weather.title'), i18next.t('toasts.weatherutils.weathererror'), 'normal', 'danger');
    }
}

// Main weather functions
export function submitWeatherSettings(
    key?: string,
    lat?: number,
    lon?: number,
    units?: WeatherUnits
): void {
    let settings: WeatherSettings | null = null;

    // Use provided parameters or parse from form
    if (key !== undefined && lat !== undefined && lon !== undefined && units !== undefined) {
        if (!isValidLatitude(lat) || !isValidLongitude(lon)) {
            logConsole('Invalid latitude or longitude provided.', 'error');
            return;
        }
        settings = { key, lat, lon, units };
    } else {
        settings = parseWeatherSettingsFromForm();
    }

    if (!settings) {
        return;
    }

    toggleWeatherMenuState(true);

    // Initial weather fetch
    handleWeatherUpdate(settings).then(() => {
        // Start periodic updates
        weatherInterval = setInterval(() => {
            handleWeatherUpdate(settings!);
        }, WEATHER_UPDATE_INTERVAL);
    });
}

export function stopWeather(): void {
    if (weatherInterval) {
        clearInterval(weatherInterval);
    }
    
    toggleWeatherMenuState(false);
    weather.container.classList.add('d-none');
    menu.weatherstopbtn.disabled = true;
    
    logConsole('Weather interval stopped.', 'info');
}

// Weather widget positioning
function resetWeatherPosition(): void {
    // Hide position label, now default
    menu.weatherposlabel.classList.add('d-none');

    weather.container.style.left = '';
    weather.container.style.top = '';
    weather.container.style.bottom = '';
    logConsole('Weather widget position reset.', 'info');
}

function setupWeatherDragging(): void {
    weather.container.addEventListener('mousedown', (e) => {
        if (!isWeatherMoving) return;
        
        weather.container.style.cursor = 'grabbing';
        
        // Convert from bottom positioning to top positioning
        const rect = weather.container.getBoundingClientRect();
        const topPosition = rect.top;
        
        weather.container.style.bottom = 'auto';
        weather.container.style.top = `${topPosition}px`;
        
        const startX = e.clientX - weather.container.offsetLeft;
        const startY = e.clientY - topPosition;
        
        const containerWidth = rect.width;
        const containerHeight = rect.height;

        function onMouseMove(e: MouseEvent) {
            const posX = e.clientX - startX;
            const posY = e.clientY - startY;

            // Constrain to viewport bounds
            const clampedX = Math.max(0, Math.min(posX, window.innerWidth - containerWidth));
            const clampedY = Math.max(0, Math.min(posY, window.innerHeight - containerHeight));

            weather.container.style.left = `${clampedX}px`;
            weather.container.style.top = `${clampedY}px`;

            // Update position label
            menu.weatherposlabel.classList.remove('d-none');
            menu.weatherposlabel.innerText = `X: ${Math.round(clampedX)} Y: ${Math.round(clampedY)}`;
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            weather.container.style.cursor = 'grab';
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    weather.container.addEventListener('dblclick', () => {
        if (isWeatherMoving) {
            resetWeatherPosition();
        }
    });
}

// Event handlers
async function handleGeolocationButton(): Promise<void> {
    try {
        const coordinates = await getLocation();
        menu.weatherlatinput.value = coordinates.latitude.toString();
        menu.weatherloninput.value = coordinates.longitude.toString();
        logConsole(`Retrieved geolocation: ${coordinates.latitude}, ${coordinates.longitude}`, 'debug');
    } catch (error) {
        logConsole(`Failed to get location: ${error}`, 'error');
    }
}

function handleMoveToggle(button: HTMLButtonElement): void {
    isWeatherMoving = button.classList.contains('active');
    weather.container.style.cursor = isWeatherMoving ? 'grab' : 'default';
    logConsole(`Weather moving toggle set to: ${isWeatherMoving}`, 'debug');
}

// Event listeners setup
function setupEventListeners(): void {
    panel.section.we.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        
        if (target.tagName === 'BUTTON') {
            const button = target as HTMLButtonElement;
            
            match(button.id)
                .with('weatherGeoBtn', () => handleGeolocationButton())
                .with('weatherSubmitBtn', () => submitWeatherSettings())
                .with('weatherStopBtn', () => stopWeather())
                .with('weatherMoveToggle', () => handleMoveToggle(button))
                .with('weatherMoveReset', () => resetWeatherPosition())
                .otherwise(() => {});
        }
    });

    setupWeatherDragging();
}

// Initialize weather utilities
setupEventListeners();
