const APIKey = 'placeholder'
// Temporary Default City
const Denver = 'Denver'



function GetCityWeatherData(city) {
    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIKey

    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(response) {
      console.log(response)
      $('#CurrentCity').text(response.name);
      $('#CurrentCityTemp').text('Tempature: ' + Math.floor(response.main.temp * (9/5) - 459.67) + ' °F');
      $('#CurrentCityHum').text('Humidity: ' + response.main.humidity + '%');
      $('#CurrentCityWS').text('Wind Speed: ' + response.wind.speed + ' MPH');
      $('#CurrentCityUV').text('UV Index: ' + '9.49');
    });
}

GetCityWeatherData(Denver);