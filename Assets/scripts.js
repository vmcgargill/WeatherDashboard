var APIKey = "427dafd025ad63d9f707076c8b4e121e";
var TimeZone = moment.tz.zone(moment.tz.guess()).abbr(360);

function GetTodaysWeather(weatherURL) {
  var CurrentDate = moment().format('dddd, MMMM Do, YYYY @ha');
  $.ajax({
    url: weatherURL,
    method: 'GET'
  }).then(function(response) {
    var lat = response.coord.lat;
    var lon = response.coord.lon;
    GetUVIndex(lat, lon);
    $('#CurrentCity').text(response.name + " - " + CurrentDate + " " + TimeZone);
    $('#CurrentCityTemp').text('Tempature: ' + Math.floor(response.main.temp * (9/5) - 459.67) + ' °F');
    $('#CurrentCityHum').text('Humidity: ' + response.main.humidity + '%');
    $('#CurrentCityWS').text('Wind Speed: ' + response.wind.speed + ' MPH');
  });
}

function GetUVIndex(lat, lon) {
  var UVIndexURL = 'https://api.openweathermap.org/data/2.5/uvi?appid=' + APIKey + '&lat=' + lat + '&lon=' + lon
  $.ajax({
    url: UVIndexURL,
    method: 'GET'
  }).then(function(response) {
    const CurrentCityUV = $('#CurrentCityUV');
    if (response.value <= 2) {
      CurrentCityUV.html("UV Index: " + '<a class="greenUV">' + response.value + '</a>');
    } else if (response.value > 2 && response.value < 5) {
      CurrentCityUV.html("UV Index: " + '<a class="yellowUV">' + response.value + '</a>');
    } else if (response.value >= 5 && response.value < 7) {
      CurrentCityUV.html("UV Index: " + '<a class="orangeUV">' + response.value + '</a>');
    } else if (response.value >= 7 && response.value < 10) {
      CurrentCityUV.html("UV Index: " + '<a class="redUV">' + response.value + '</a>');
    } else if (response.value >= 10) {
      CurrentCityUV.html("UV Index: " + '<a class="purpleUV">' + response.value + '</a>');
    }
  });
}

function GetWeatherForecast(forecastURL) {
  $.ajax({
    url: forecastURL,
    method: 'GET'
  }).then(function(response) {
    $('#FutureForcastDiv').text("");
    for (i = 5; i <= 39; i+=8) {
      var day = $('<div>').attr('class', 'FutureForcast');
      $('#FutureForcastDiv').append(day);
      var Date = new moment(response.list[i].dt_txt);
      $(day).append($('<p>').text(Date.format('dddd, MM/DD/YYYY @ha') + ' ' + TimeZone));
      var WeatherIconURL = 'https://openweathermap.org/img/wn/' + response.list[i].weather[0].icon + '@2x.png';
      var IMG = $('<img>').attr("src", WeatherIconURL);
      IMG.width(40);
      $(day).append(IMG);
      $(day).append($('<p>').text('Temp: ' + Math.floor(response.list[i].main.temp * (9/5) - 459.67) + ' °F'));
      $(day).append($('<p>').text('Humidity: ' + response.list[i].main.humidity + '%'));
    }
  });
}

function GetCityWeatherData(location) {
  var weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + location + '&appid=' + APIKey
  GetTodaysWeather(weatherURL);
  var forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + location + '&appid=' + APIKey
  GetWeatherForecast(forecastURL);
}

function GetCordWeatherData() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showLocationWeather);
  }
  function showLocationWeather(position) {
    var weatherURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + 
    position.coords.latitude + '&lon=' + position.coords.longitude +'&appid=' + APIKey
    GetTodaysWeather(weatherURL);
    var forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + 
    position.coords.latitude + '&lon=' + position.coords.longitude +'&appid=' + APIKey
    GetWeatherForecast(forecastURL);
  }
}

$(document).on('click','.city',function(){
  var CityValue = $(this).val();
  GetCityWeatherData(CityValue);
});

$(document).on('click','#SearchLocation',function(){
  var LocationValue = $('#SearchLocationInput').val();
  GetCityWeatherData(LocationValue);
});

/// Default Location ///
GetCityWeatherData('Denver');