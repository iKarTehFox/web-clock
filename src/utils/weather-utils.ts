import { match } from 'ts-pattern';
import OpenWeatherMap from 'openweathermap-ts';
import { menu, panel, weather } from './dom-elements';
import { getFirstElement } from './dom-selectors';
import { logConsole, showToast } from './dom-utils';
import { CurrentResponse } from 'openweathermap-ts/dist/types';
import i18next from 'i18next';

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
                    showToast(i18next.t('toasts.weatherutils.gpserror', { 0: error }), 'default', 'danger');
                    reject(error);
                },
                { enableHighAccuracy: true }
            );
        });
    } else {
        showToast(i18next.t('toasts.weatherutils.gpsunsupported'), 'long', 'danger');
        throw new Error('Geolocation is not supported by this browser.');
    }
}

// Utility function to fetch OWM JSON
async function fetchWeather(appID: string, lat: number, lon: number, units: any) {
    const owm = new OpenWeatherMap({
        apiKey: appID,
        units: units,
        language: i18next.language
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
    const tempunit = units == 'imperial' ? i18next.t('weather.fahrenheit') : i18next.t('weather.celsius');
    const windunit = units == 'imperial' ? i18next.t('weather.mph') : i18next.t('weather.ms');

    // Fill weather widget data. Can this be done better? Probably...
    weather.name.innerText = `${data.name}, ${data.sys.country}`;
    weather.temp.innerText = `${data.main.temp}°${tempunit}`;
    weather.feelslike.innerText = `${data.main.feels_like}°${tempunit}`;
    weather.mintemp.innerText = `${data.main.temp_min}°${tempunit}`;
    weather.maxtemp.innerText = `${data.main.temp_max}°${tempunit}`;
    weather.wind.innerText = `${data.wind.speed} ${windunit} ${deg2dir(data.wind.deg)}`;
    weather.condition.innerText = `${data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}`;

    // Icon logic
    logConsole(`Received weather icon code: ${data.weather[0].icon}`, 'info');
    weather.icon.className = match(data.weather[0].icon)
        .with('01d', () => 'bi bi-sun fs-4') // clear sky (day)
        .with('01n', () => 'bi bi-moon fs-4') // clear sky (night)
        .with('02d', () => 'bi bi-cloud-sun fs-4') // few clouds (day)
        .with('02n', () => 'bi bi-cloud-moon fs-4') // few clouds (night)
        .with('03d', '03n', () => 'bi bi-cloud fs-4') // scattered clouds
        .with('04d', '04n', () => 'bi bi-clouds fs-4') // broken clouds
        .with('09d', '09n', () => 'bi bi-cloud-drizzle fs-4') // shower rain
        .with('10d', '10n', () => 'bi bi-cloud-rain-heavy fs-4') // rain
        .with('11d', '11n', () => 'bi bi-cloud-lightning fs-4') // thunderstorm
        .with('13d', '13n', () => 'bi bi-snow fs-4') // snow
        .with('50d', '50n', () => 'bi bi-cloud-fog fs-4') // mist
        .otherwise(() => 'bi bi-cloud fs-4');

    weather.container.classList.remove('d-none');
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
                showToast(i18next.t('toasts.weatherutils.weathererror'), 'normal', 'danger');
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
    const translatedDirection = i18next.t(`weather.${directions[index]}`);
    return translatedDirection;
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
    weather.container.classList.add('d-none');
    menu.weathersubmitbtn.disabled = false;
    menu.weatherstopbtn.disabled = true;
    logConsole('Weather interval stopped.', 'info');
}

// Weather move toggle listener
let isMoving: boolean = false;

panel.section.we.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    
    match(target.tagName)
        .with('BUTTON', () => {
            const buttonElement = target as HTMLButtonElement;
            match(buttonElement.id)
                .with('weatherGeoBtn', async () => {
                    try {
                        const latlonArray = await getLocation();
                        menu.weatherlatinput.value = latlonArray[0].toString();
                        menu.weatherloninput.value = latlonArray[1].toString();
                        logConsole(`Retrieved geolocation: ${latlonArray}`, 'debug');
                    } catch (error) {
                        logConsole(`Failed to get location: ${error}`, 'error');
                    }
                })
                .with('weatherSubmitBtn', () => {
                    submitWeatherSettings();
                })
                .with('weatherStopBtn', () => {
                    stopWeather();
                })
                .with('weatherMoveToggle', () => {
                    isMoving = buttonElement.classList.contains('active');
                    weather.container.style.cursor = isMoving ? 'grab' : 'default';
                    logConsole(`Weather moving toggle set to: ${isMoving}`, 'debug');
                })                
                .with('weatherMoveReset', () => {
                    weather.container.style.left = '';
                    weather.container.style.top = '';
                    weather.container.style.bottom = '';
                    logConsole('Weather widget position reset...', 'info');
                })
                .otherwise(() => {});
        })
        .otherwise(() => {});
});

weather.container.addEventListener('mousedown', (e) => {
    if (!isMoving) return;
    
    weather.container.style.cursor = 'grabbing';
    logConsole('Weather widget mousedown...', 'info');
    
    // Convert from bottom positioning to top positioning
    const rect = weather.container.getBoundingClientRect();
    const topPosition = rect.top;
    
    // Clear bottom positioning and set top positioning
    weather.container.style.bottom = 'auto';
    weather.container.style.top = `${topPosition}px`;
    
    const startX = e.clientX - weather.container.offsetLeft;
    const startY = e.clientY - topPosition; // Use the calculated top position
    
    // Get container dimensions once at the start
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    function onMouseMove(e: { clientX: number; clientY: number; }) {
        const posX = e.clientX - startX;
        const posY = e.clientY - startY;

        // Constrain to viewport bounds
        const clampedX = Math.max(0, Math.min(posX, window.innerWidth - containerWidth));
        const clampedY = Math.max(0, Math.min(posY, window.innerHeight - containerHeight));

        weather.container.style.left = `${clampedX}px`;
        weather.container.style.top = `${clampedY}px`;
        logConsole(`Weather widget moving. PosX: ${clampedX}, PosY: ${clampedY}`, 'debug');
    }

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        weather.container.style.cursor = 'grab';
        logConsole('Weather widget mouseup...', 'info');
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

weather.container.addEventListener('dblclick', () => {
    if (!isMoving) return;
    weather.container.style.left = '';
    weather.container.style.top = '';
    weather.container.style.bottom = '';
    logConsole('Weather widget position reset...', 'info');
});
