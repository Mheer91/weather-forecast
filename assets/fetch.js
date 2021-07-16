var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=41.8781&lon=-87.6298&appid=6845bd9653c312c4a4d4b0a988d5d986';
var userInput = document.querySelector("textarea").value;

fetch(requestUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
    });

function queryString(){
    console.log(userInput)
}