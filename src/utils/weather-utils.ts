import OpenWeatherMap from 'openweathermap-ts';
import { menu, weather } from '../global';
import { getFirstElement, logConsole, showToast } from './dom-utils';
import { CurrentResponse } from 'openweathermap-ts/dist/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let interval: NodeJS.Timeout;

// Geolocation function
export function getLocation(): Promise<[number, number]> {
    if (navigator.geolocation) {
        return new Promise<[number, number]>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    resolve([latitude, longitude]);
                },
                (error) => {
                    reject(error);
                },
                { enableHighAccuracy: true }
            );
        });
    } else {
        throw new Error('Geolocation is not supported by this browser.');
    }
}

// Utility function to fetch OWM JSON
async function fetchWeather(appID: string, lat: number, lon: number, units: any) {
    const owm = new OpenWeatherMap({
        apiKey: appID,
        units: units
    });

    try {
        const currentWeatherData = await owm.getCurrentWeatherByGeoCoordinates(lat, lon);
        return currentWeatherData;
    } catch (error) {
        logConsole(`Failed fetching weather data: ${error}`, 'error');
        throw error;
    }
}

function updateWeatherWidget(data: CurrentResponse, units: string) {
    const tempunit = units == 'imperial' ? 'F' : 'C';
    const windunit = units == 'imperial' ? 'mph' : 'm/s';

    weather.name.innerText = `${data.name}, ${data.sys.country}`;
    weather.temp.innerText = `${data.main.temp}°${tempunit}`;
    weather.feelslike.innerText = `${data.main.feels_like}°${tempunit}`;
    weather.mintemp.innerText = `${data.main.temp_min}°${tempunit}`;
    weather.maxtemp.innerText = `${data.main.temp_max}°${tempunit}`;
    weather.wind.innerText = `${data.wind.speed} ${windunit} ${deg2dir(data.wind.deg)}`;
    weather.condition.innerText = `${data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}`;

    // Icon logic
    switch (data.weather[0].icon) {
    case '01d': // clear sky
        weather.icon.setAttribute('icon', 'mdi:weather-sunny');
        break;
    case '02d': // few clouds
        weather.icon.setAttribute('icon', 'mdi:weather-partly-cloudy');
        break;
    case '03d': //scattered clouds
        weather.icon.setAttribute('icon', 'mdi:weather-cloudy');
        break;
    case '04d': // broken clouds
        weather.icon.setAttribute('icon', 'mdi:weather-cloudy');
        break;
    case '09d': // shower rain
        weather.icon.setAttribute('icon', 'mdi:weather-partly-rainy');
        break;
    case '10d': // rain
        weather.icon.setAttribute('icon', 'mdi:weather-pouring');
        break;
    case '11d': // thunderstorm
        weather.icon.setAttribute('icon', 'mdi:weather-lightning');
        break;
    case '13d': // snow
        weather.icon.setAttribute('icon', 'mdi:weather-snowy');
        break;
    case '50d': // mist
        weather.icon.setAttribute('icon', 'mdi:weather-fog');
        break;
    default:
        weather.icon.setAttribute('icon', 'mdi:weather-cloudy');
        break;
    }

    weather.container.className = 'weather-container';
}

export function submitWeatherSettings(): void {
    if (menu.weatherapiinput.value !== '' && menu.weatherlatinput.value!== '' && menu.weatherloninput.value!== '') {
        // Get all values
        const key = menu.weatherapiinput.value;
        const lat = parseFloat(menu.weatherlatinput.value);
        const lon = parseFloat(menu.weatherloninput.value);
        const units = getFirstElement<HTMLElement>('input[name="weather-unit-radio"]:checked').id;
        weatherMenuDisable(true);

        // Initial fetch
        fetchWeather(key, lat, lon, units)
            .then(currentWeatherData => {
                if (currentWeatherData.cod === 200) {
                    updateWeatherWidget(currentWeatherData, units);
                    logConsole('Weather data fetched successfully.', 'info');
                } else {
                    stopWeather();
                    logConsole(`Failed fetching weather data: ${currentWeatherData.cod}`, 'error');
                    showToast(`Error fetching weather data: ${currentWeatherData.cod}`, 5000, 'danger');
                }
            })
            .catch(error => {
                stopWeather();
                logConsole(`Failed while handling weather data: ${error}`, 'error');
            });

        // Start 15m interval
        interval = setInterval(() => {
            fetchWeather(key, lat, lon, units)
                .then(currentWeatherData => {
                    if (currentWeatherData.cod === 200) {
                        updateWeatherWidget(currentWeatherData, units);
                        logConsole('Updated weather data.', 'info');
                    } else {
                        stopWeather();
                        logConsole(`Failed to update weather data: ${currentWeatherData.cod}`, 'error');
                    }
                })
                .catch(error => {
                    stopWeather();
                    logConsole(`Failed while handling weather data: ${error}`, 'error');
                });
        }, 900000);
    }
}

function deg2dir(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}


function weatherMenuDisable(disabled: boolean) {
    menu.weatherapiinput.disabled = disabled;
    menu.weatherlatinput.disabled = disabled;
    menu.weatherloninput.disabled = disabled;
    menu.weathergeobtn.disabled = disabled;
    menu.weatherunitradio.forEach((radio) => {
        radio.disabled = disabled;
    });
    menu.weathersubmitbtn.disabled = disabled;
}

export function stopWeather() {
    clearInterval(interval);
    weatherMenuDisable(false);
    weather.container.className = 'weather-hidden';
    menu.weathersubmitbtn.disabled = false;
    menu.weatherstopbtn.disabled = true;
    logConsole('Weather interval stopped.', 'info');
}