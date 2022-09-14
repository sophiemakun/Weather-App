/** @format */

const notificationElement = document.querySelector('.notification');
const iconElement = document.querySelector('.weather-icon');
const tempElement = document.querySelector('.temperature-value p');
const descElement = document.querySelector('.temperature-description p');
const locationElement = document.querySelector('.location p');
const search = document.querySelector('.search');

const weather = {};

weather.temperature = {
  unit: 'celsius',
};

const KELVIN = 273;

const key = 'b92fc960e148cadebcf419efb66dd6d4';

if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.style.display = 'block';
  notificationElement.innerHTML = "<p>Browser Doesn't Support Geolocation.</p>";
}

function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  getWeather(latitude, longitude);
}
function setAddress() {
  getLocation(search.value);
}

function getLocation(location) {
  let api = `https://api.geoapify.com/v1/geocode/search?text=${location}&format=json&apiKey=d548c5ed24604be6a9dd0d989631f783`;

  fetch(api)
    .then((res) => {
      let data = res.json();
      return data;
    })
    .then((data) => {
      console.log(data.results[0].lon, data.results[0].lat);
      getWeather(data.results[0].lat, data.results[0].lon);
    });
}

function showError(error) {
  notificationElement.style.display = 'block';
  notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

function getWeather(latitude, longitude) {
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

  fetch(api)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      weather.temperature.value = Math.floor(data.main.temp - KELVIN);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
    })
    .then(function () {
      displayWeather();
    });
}

function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value} ° <span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

function celsiusToFahrenheit(temperature) {
  return (temperature * 9) / 5 + 32;
}

tempElement.addEventListener('click', function () {
  if (weather.temperature.value === undefined) return;
  if (weather.temperature.unit === 'celsius') {
    let fahrenheit = celsiusToFahrenheit(weather.temperature.value);

    fahrenheit = Math.floor(fahrenheit);

    tempElement.innerHTML = `${fahrenheit}° <span>F</span>`;

    weather.temperature.unit = 'fahrenheit';
  } else {
    tempElement.innerHTML = `${weather.temperature.value}° <span>C</span>`;

    weather.temperature.unit = 'celsius';
  }
});
