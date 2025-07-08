const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Search function
async function search(location) {
  try {
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=7d77b96c972b4d119a3151101212704&q=${location}&days=3`);
    if (response.ok && response.status !== 400) {
      let data = await response.json();
      displayCurrent(data.location, data.current);
      displayAnother(data.forecast.forecastday);
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// Display the current weather
function displayCurrent(location, current) {
  if (current != null) {
    let date = new Date(current.last_updated.replace(" ", "T"));
    let content = `
      <div class="today forecast">
        <div class="forecast-header" id="today">
          <div class="day">${days[date.getDay()]}</div>
          <div class="date">${date.getDate()} ${monthNames[date.getMonth()]}</div>
        </div>
        <div class="forecast-content" id="current">
          <div class="location">${location.name}</div>
          <div class="degree">
            <div class="num">${current.temp_c}<sup>o</sup>C</div>
            <div class="forecast-icon">
              <img src="https:${current.condition.icon}" alt="" width="90">
            </div>
          </div>
          <div class="custom">${current.condition.text}</div>
          <span><img src="imgs/icon-umberella.png" alt="">${current.humidity}%</span>
          <span><img src="imgs/icon-wind.png" alt="">${current.wind_kph}km/h</span>
          <span><img src="imgs/icon-compass.png" alt="">${current.wind_dir}</span>
        </div>
      </div>`;
    document.getElementById("forecast").innerHTML = content;
  }
}

// Show the next days
function displayAnother(forecastDays) {
  let content = "";
  for (let i = 1; i < forecastDays.length; i++) {
    let date = new Date(forecastDays[i].date.replace(" ", "T"));
    content += `
      <div class="forecast">
        <div class="forecast-header">
          <div class="day">${days[date.getDay()]}</div>
        </div>
        <div class="forecast-content">
          <div class="forecast-icon">
            <img src="https:${forecastDays[i].day.condition.icon}" alt="" width="48">
          </div>
          <div class="degree">${forecastDays[i].day.maxtemp_c}<sup>o</sup>C</div>
          <small>${forecastDays[i].day.mintemp_c}<sup>o</sup></small>
          <div class="custom">${forecastDays[i].day.condition.text}</div>
        </div>
      </div>`;
  }
  document.getElementById("forecast").innerHTML += content;
}

// Perform search on write (with delay to prevent overflow)
function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}
document.getElementById("search").addEventListener("keyup", debounce(e => {
  search(e.target.value);
}, 500));

// Load the default weather for Cairo at the top of the page
search("cairo");
