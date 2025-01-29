import { match } from 'ts-pattern';
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
                    showToast(`Error getting location: ${error.message}`, 'default', 'danger');
                    reject(error);
                },
                { enableHighAccuracy: true }
            );
        });
    } else {
        showToast('Geolocation is not supported by this browser.', 'long', 'danger');
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

    // Fill weather widget data. Can this be done better? Probably...
    weather.name.innerText = `${data.name}, ${data.sys.country}`;
    weather.temp.innerText = `${data.main.temp}°${tempunit}`;
    weather.feelslike.innerText = `${data.main.feels_like}°${tempunit}`;
    weather.mintemp.innerText = `${data.main.temp_min}°${tempunit}`;
    weather.maxtemp.innerText = `${data.main.temp_max}°${tempunit}`;
    weather.wind.innerText = `${data.wind.speed} ${windunit} ${deg2dir(data.wind.deg)}`;
    weather.condition.innerText = `${data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}`;

    // Icon logic
    weather.icon.setAttribute('icon', match(data.weather[0].icon)
        .with('01d', () => 'mdi:weather-sunny')
        .with('02d', () => 'mdi:weather-partly-cloudy')
        .with('03d', () => 'mdi:weather-cloudy')
        .with('04d', () => 'mdi:weather-cloudy')
        .with('09d', () => 'mdi:weather-partly-rainy')
        .with('10d', () => 'mdi:weather-pouring')
        .with('11d', () => 'mdi:weather-lightning')
        .with('13d', () => 'mdi:weather-snowy')
        .with('50d', () => 'mdi:weather-fog')
        .otherwise(() => 'mdi:weather-cloudy')
    );

    weather.container.className = 'weather-container';
}

export function submitWeatherSettings(_key: string = undefined, _lat: number = undefined, _lon: number = undefined, _units: string = undefined): void {
    let key: string;
    let lat: number;
    let lon: number;
    let units: string;

    // Check for passed parameters
    if (_key !== undefined && _lat !== undefined && _lon !== undefined && (_units == 'imperial' || _units == 'metric')) {
        key = _key;
        lat = _lat;
        lon = _lon;
        units = _units;
    } else if (menu.weatherapiinput.value !== '' && menu.weatherlatinput.value!== '' && menu.weatherloninput.value!== '') {
        key = menu.weatherapiinput.value;
        lat = parseFloat(menu.weatherlatinput.value);
        lon = parseFloat(menu.weatherloninput.value);
        units = getFirstElement<HTMLElement>('input[name="weather-unit-radio"]:checked').id;
    } else {
        logConsole('Not all weather settings were provided.', 'info');
        return;
    }

    // Check for valid lat/lon
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        logConsole('Invalid latitude or longitude.', 'error');
        return;
    }

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
                showToast(`Error fetching weather data: ${currentWeatherData.cod}`, 'normal', 'danger');
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
    menu.weathermovetoggle.disabled = !disabled;
    menu.weathermovereset.disabled = !disabled;
    menu.weatherstopbtn.disabled = !disabled;
}

export function stopWeather() {
    clearInterval(interval);
    weatherMenuDisable(false);
    weather.container.className = 'weather-hidden';
    menu.weathersubmitbtn.disabled = false;
    menu.weatherstopbtn.disabled = true;
    logConsole('Weather interval stopped.', 'info');
}
