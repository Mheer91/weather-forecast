var landingPage = document.getElementById("landingPage");
var fiveDayForecast = document.getElementById("fiveDayForecast");
var todaysForecast = document.querySelector("#todaysForecast");
var searchButton = document.getElementById("searchButton");
var textArea = document.querySelector("textarea");
var recentSearches = document.getElementById("recentSearches");
const apiKey = 'a398120afa294e44852ef43b16bff5cf';


//This function transitions the page to the 5 day forecast layout and executes the search parameters for the API as well as executing the main functionality of the search list. 
function search() {
    fiveDayForecast.innerHTML = "";
    landingPage.classList.remove("s12");
    landingPage.classList.add("s3");
    recentSearches.classList.remove("hide");

    for (let i = 0; i < 9; i++) {
        var searchLink = document.getElementById(`search${[i]}`)

        if (searchLink.textContent == "") {
            searchLink.textContent = textArea.value;
            searchLink.classList.remove("hide");
            break;
        };

    };


    //Event listener that works with each "recently searched" link individually.
    searchLink.addEventListener("click", function () {
        fiveDayForecast.innerHTML = "";
        let requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + this.textContent + '&appid=' + apiKey;

        fetch(requestUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data)
                localStorage.setItem("lat", data.coord.lat);
                localStorage.setItem("lon", data.coord.lon);
                localStorage.setItem("city", data.name);
                getWeather();
            });
    })
    cityLatLon();
    textArea.value = "";
};

//This function calls the weather API by city so that we can locally store the lat and lon and make another call. We have to do this because the openweather onecall api doesn't allow a city search.
function cityLatLon() {
    let requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + textArea.value + '&appid=' + apiKey;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            localStorage.setItem("lat", data.coord.lat);
            localStorage.setItem("lon", data.coord.lon);
            localStorage.setItem("city", data.name);
            getWeather();
        });
};


//Now that we have the lat/lon, we can use this function to do a multitude of things. First, we call the openweather onecall API to get our data. Then we plug input cards onto the page with all of the data displayed. 
function getWeather() {
    let lat = localStorage.getItem("lat");
    let lon = localStorage.getItem("lon");
    let requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            let city = localStorage.getItem("city");
            let currentDate = new Date(data.current.dt * 1000).toLocaleString();
            let icon = (data.current.weather[0].icon).toLocaleString();
            let currentTemp = Math.round(((data.current.temp - 273.15) * 1.8) + 32) + "°F";
            let currentHumidity = data.current.humidity + "%";
            let currentWindSpeed = data.current.wind_speed + "mph";
            let uvIndex = data.current.uvi;

            todaysForecast.innerHTML = `
            <div class="card blue-grey darken-1">
                <div class="card-content black-text">
                    <ul class="collection with-header">
                        <li class="collection-header teal"><h4>${city + "     ---    " + currentDate.split(",")[0]}</h4><img style="height:50px width:50px" src="http://openweathermap.org/img/wn/${icon}@2x.png" alt=""></h4></li>
                        <li class="collection-item yellow darken-4">Temperature: ${currentTemp}</li>
                        <li class="collection-item yellow darken-3">Humidity: ${currentHumidity}</li>
                        <li class="collection-item yellow darken-2">Wind Speed: ${currentWindSpeed}</li>
                        <li class="collection-item" id="uvColorCurrent">UV Index: ${uvIndex}</li>
                    </ul>
                </div>
            </div>`;

            let color = document.getElementById(`uvColorCurrent`);

                    if (uvIndex < 3){
                        color.classList.add("green");
                    }
                    else if ((uvIndex >= 3) && (uvIndex < 6)){
                        color.classList.add("yellow");
                    }
                    else if ((uvIndex >= 6) && (uvIndex < 8)){
                        color.classList.add("orange");
                    }
                    else if ((uvIndex >= 8) && (uvIndex < 11)){
                        color.classList.add("red");
                    }
                    else {
                        color.classList.add("purple");
                    }


            //Weather Card generator. 
            for (i = 0; i < 6; i++) {
                let forecastDate = new Date(data.daily[i + 1].dt * 1000).toLocaleString();
                let icon = data.daily[i].weather[0].icon;
                let forecastTemp = Math.round(((data.daily[i].temp.day - 273.15) * 1.8) + 32) + "°F";
                let forecastHumidity = data.daily[i].humidity + "%";
                let forecastWindSpeed = data.daily[i].wind_speed + "mph";
                let forecastUvIndex = data.daily[i].uvi;

                function addForecastCard() {
                    let forecastCard = document.createElement("DIV");
                    forecastCard.classList.add("col", "s2", "scale-transition", "scale-in");
                    forecastCard.setAttribute("id", `weatherCard${[i]}`)
                    forecastCard.innerHTML = `
                        <div class="card blue-grey darken-1">
                            <div class="card-content black-text">
                                <ul class="collection with-header">
                                    <li class="collection-header teal"><h4>${forecastDate.split(",")[0]}</h4><img style="height:50px width:50px" src="http://openweathermap.org/img/wn/${icon}@2x.png" alt=""></h4></li>
                                    <li class="collection-item yellow darken-4">Temperature: ${forecastTemp}</li>
                                    <li class="collection-item yellow darken-3">Humidity: ${forecastHumidity}</li>
                                    <li class="collection-item yellow darken-2">Wind Speed: ${forecastWindSpeed}</li>
                                    <li class="collection-item" id="uvColorForecast${[i]}">UV Index: ${forecastUvIndex}</li>
                                </ul>
                            </div>
                        </div>`;

                    fiveDayForecast.appendChild(forecastCard);
                };
                addForecastCard();
                let color = document.getElementById(`uvColorForecast${[i]}`);

                if (forecastUvIndex < 3) {
                    color.classList.add("green");
                }
                else if ((forecastUvIndex >= 3) && (forecastUvIndex < 6)) {
                    color.classList.add("yellow");
                }
                else if ((forecastUvIndex >= 6) && (forecastUvIndex < 8)) {
                    color.classList.add("orange");
                }
                else if ((forecastUvIndex >= 8) && (forecastUvIndex < 11)) {
                    color.classList.add("red");
                }
                else {
                    color.classList.add("purple");
                }
            }
        });

};


//Event listeners for the search button and enter key. 
searchButton.addEventListener("click", search);
textArea.addEventListener("keydown", function (event) {
    if (event.key === 'Enter') {
        search();
    }
});

