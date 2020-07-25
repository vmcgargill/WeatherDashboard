const APIKey = config.SECRET_KEY;
const OpwenWeatherLink = 'https://api.openweathermap.org/data/2.5/weather?q=';
const OpwenWeatherLink2 = '&appid=';
const DefaultLocation = 'Denver';



function GetCityWeatherData(location) {
    var queryURL = OpwenWeatherLink + location + OpwenWeatherLink2 + APIKey

    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(response) {
      $('#CurrentCity').text(response.name);
      $('#CurrentCityTemp').text('Tempature: ' + Math.floor(response.main.temp * (9/5) - 459.67) + ' °F');
      $('#CurrentCityHum').text('Humidity: ' + response.main.humidity + '%');
      $('#CurrentCityWS').text('Wind Speed: ' + response.wind.speed + ' MPH');
      $('#CurrentCityUV').text('UV Index: ' + '9.49');
    });
}

GetCityWeatherData(DefaultLocation);

$(document).on('click','.city',function(){
  var CityValue = $(this).val();
  GetCityWeatherData(CityValue);
});

$(document).on('click','#SearchLocation',function(){
  var LocationValue = $('#SearchLocationInput').val();
  GetCityWeatherData(LocationValue);
});