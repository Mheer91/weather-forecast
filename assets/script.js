var landingPage = document.getElementById("landingPage");
var weatherCard = document.querySelectorAll("weatherCard");
var weatherCardId = document.getElementById("weatherCard");
var fiveDayForecast = document.getElementById("fiveDayForecast");
var searchButton = document.getElementById("searchButton");
var textArea = document.querySelector("textarea");
var recentSearches = document.getElementById("recentSearches");


function search(){
    landingPage.classList.remove("s12");
    landingPage.classList.add("s3");
    fiveDayForecast.classList.remove("hide");
    console.log(textArea.value);
    recentlySearched();
    textArea.value = "";

}

function recentlySearched(){
    localStorage.setItem(textArea.value, textArea.value);

    let recentSearch = localStorage.getItem(textArea.value);
    let newLi = document.createElement("li");
    let newLiText = document.createTextNode(recentSearch);
    newLi.appendChild(newLiText);
    console.log(recentSearch)


}

searchButton.addEventListener("click", search);