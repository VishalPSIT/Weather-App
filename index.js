const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm =document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

const API_key = "48b49240e19d31e21c29538d0ca220bc";
let currTab = userTab;
currTab.classList.add("current-tab");
getfromSessionStorage(); 

function switchTab(clickedTab){
    if (clickedTab != currTab){
        currTab.classList.remove("current-tab");
        currTab = clickedTab;
        currTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

function getfromSessionStorage(){
    const localCordinates = sessionStorage.getItem("user-coordinates");
    if (!localCordinates){
        grantAccessContainer.classList.add("active");
    }else{
        const coordinates = JSON.parse(localCordinates);
        fetchWeatherInfo(coordinates);
    }
}
async function fetchWeatherInfo(coordinates){
    const {lat,long} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    //api calll
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_key}`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
    }
    catch(e){

    }
}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});

function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc");
    const weatherIcon  = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-clouds]");

    cityName.innerText=weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src =  `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${(weatherInfo?.main?.temp - 273.15).toFixed(2)}°C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

const grantAccessBtn = document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click" , getLocation);
function getLocation(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);

    }else{
        alert("geolocation support not available");
    }
}
function showPosition(position){
    const userCoordinates={
        lat : position.coords.latitude,
        long : position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates));
    fetchWeatherInfo(userCoordinates);
}
let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit" , (e)=>{
    e.preventDefault();
    let cityName = searchInput.value;
    if (cityName === "") return;
    else fetchSearchInfo(cityName);

});
async function fetchSearchInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`);
        const data = await response.json();
        userInfoContainer.classList.add("active");
        loadingScreen.classList.remove("active");
        renderWeatherInfo(data);
    }
    catch(err){
        
    }
}
