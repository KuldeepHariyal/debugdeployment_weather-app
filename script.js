const button = document.getElementById("search-btn");
const locationButton = document.getElementById("location-btn");
const input = document.getElementById("city-input");
const cityName = document.getElementById("city-name");
const cityTime = document.getElementById("city-time");
const cityTemperature = document.getElementById("city-temp");
const condition = document.getElementById("condition");
const humidity = document.getElementById("Humidity");

async function getData(query) {
  const response = await fetch(`https://cors-anywhere.herokuapp.com/http://api.weatherapi.com/v1/current.json?key=0e67e1075b574ef29d982506240503&q=${query}&aqi=yes`);
  const data = await response.json();
  if (data.error) {
    throw new Error("Please enter a valid city name");
  }
  return data;
}

async function fetchDataByLocation(latitude, longitude) {
  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=0e67e1075b574ef29d982506240503&q=${latitude},${longitude}&aqi=yes`
  );
  return await response.json();
}

button.addEventListener("click", async () => {
  try {
    const value = input.value;
    const result = await getData(value);
    updateUI(result);
  } catch (error) {
    cityName.innerText = error.message;
    cityTime.innerText = "";
    cityTemperature.innerText = "";
    condition.innerText = "";
    humidity.innerText = "";
  }
});

locationButton.addEventListener("click", () => {
  // Clear the input field
  input.value = "";
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const result = await fetchDataByLocation(latitude, longitude);
      updateUI(result);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

function updateUI(result) {
  // Reset opacity to 0 to ensure the animation runs every time
  cityName.style.opacity = 0;
  cityTime.style.opacity = 0;
  cityTemperature.style.opacity = 0;
  condition.style.opacity = 0;
  humidity.style.opacity = 0;

  // Update the inner text with the fetched weather information
  cityName.innerText = `${result.location.name}, ${result.location.region}, ${result.location.country}`;
  cityTime.innerText = result.location.localtime;
  cityTemperature.innerText = `${result.current.temp_c} °C`;
  condition.innerText = `${result.current.condition.text}`;
  humidity.innerText = `Humidity: ${result.current.humidity}%`;

  // Delay setting opacity to allow the transition to take effect
  setTimeout(() => {
    // Fade in the elements by setting their opacity to 1
    cityName.style.opacity = 1;
    cityTime.style.opacity = 1;
    cityTemperature.style.opacity = 1;
    condition.style.opacity = 1;
    humidity.style.opacity = 1;
  }, 300); // Adjust delay as needed
}
