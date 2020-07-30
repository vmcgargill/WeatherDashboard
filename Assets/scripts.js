var APIKey = "427dafd025ad63d9f707076c8b4e121e";
var CurrentLocation;

$(document).ready(function(){ 
  function loadSuggestions(LocationArray) {
  $('#SearchLocationInput').autocomplete({
      lookup: LocationArray
      });
}
loadSuggestions(LocationArray)
});

function GetTodaysWeather(weatherURL) {
  var CurrentDate = moment().format('dddd, MMMM Do, YYYY @ha');
  $.ajax({
    url: weatherURL,
    method: 'GET'
  }).then(function(response) {
    $('#SearchLocationInput').val("");
    $("#errormsg").text("");
    CurrentLocation = response.name;
    var lat = response.coord.lat;
    var lon = response.coord.lon;
    GetUVIndex(lat, lon);
    var TimeZone = moment.tz.zone(moment.tz.guess()).abbr(360);
    $('#CurrentLocation').text(response.name + " - " + CurrentDate + " " + TimeZone);
    $('#CurrentLocationTemp').text('Tempature: ' + Math.floor(response.main.temp * (9/5) - 459.67) + ' °F');
    $('#CurrentLocationHum').text('Humidity: ' + response.main.humidity + '%');
    $('#CurrentLocationWS').text('Wind Speed: ' + response.wind.speed + ' MPH');
    $("#LocationButton").html("");
    var button = $("<button>");
    button.attr("class", "button")

    var Locations = JSON.parse(localStorage.getItem("Locations"));
    if (Locations.includes(CurrentLocation) === false) {
      button.attr("id", "AddLocationbtn")
      button.text("Add location")
    } else {
      button.attr("id", "RemoveLocationbtn")
      button.text("Remove location")
    }
    $("#LocationButton").append(button);
  }).fail(function() {
    //Ajax request failed.
    console.log("Error message worked!")
    $("#errormsg").text('Error: ' + '"' + $('#SearchLocationInput').val() + '" is an invalid value. Please try again.')
});
}

function GetUVIndex(lat, lon) {
  var UVIndexURL = 'https://api.openweathermap.org/data/2.5/uvi?appid=' + APIKey + '&lat=' + lat + '&lon=' + lon
  $.ajax({
    url: UVIndexURL,
    method: 'GET'
  }).then(function(response) {
    const CurrentCityUV = $('#CurrentLocationUV');
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
      $(day).append($('<p>').text(Date.format('dddd, MM/DD/YYYY @ha')));
      var WeatherIconURL = 'https://openweathermap.org/img/wn/' + response.list[i].weather[0].icon + '@2x.png';
      var IMG = $('<img>').attr("src", WeatherIconURL);
      IMG.width(40);
      $(day).append(IMG);
      $(day).append($('<p>').text('Temp: ' + Math.floor(response.list[i].main.temp * (9/5) - 459.67) + ' °F'));
      $(day).append($('<p>').text('Humidity: ' + response.list[i].main.humidity + '%'));
    }
  });
}

function GetWeatherData(location) {
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

function LoadLocations() {
  const LocationList = $("#LocationList")
  LocationList.html("");
  var h2 = $("<h2>");
  h2.text("Locations:");
  var MyLocationbtn = $("<button>");
  MyLocationbtn.attr("class", "MyLocation");
  MyLocationbtn.text("My Location");
  LocationList.append(h2);
  LocationList.append(MyLocationbtn);

  var GetLocations = localStorage.getItem("Locations");
  let LocationsArray;

  if (GetLocations === null) {
    LocationsArray = [
      "Denver",
      "New York",
      "Los Angeles"
    ]
    localStorage.setItem("Locations", JSON.stringify(LocationsArray));
  } else {
    LocationsArray = JSON.parse(GetLocations);
  }

  for (i = 0; i <= LocationsArray.length - 1; i++) {
    var button = $("<button>");
    button.attr("class", "location");
    button.val(LocationsArray[i]);
    button.text(LocationsArray[i]);
    LocationList.append(button);
  }
}

$(document).on('click','.location',function(){
  var CityValue = $(this).val();
  GetWeatherData(CityValue);
});

$(document).on('click','#SearchLocationbtn',function(){
  var LocationValue = $('#SearchLocationInput').val();
  GetWeatherData(LocationValue + ",");
});

$(document).on('click','.MyLocation',function(){
  GetCordWeatherData();
});

$(document).on('click','#AddLocationbtn',function(){
  var Locations = JSON.parse(localStorage.getItem("Locations"));
  if (Locations.includes(CurrentLocation) === false) {
    console.log(Locations);
    Locations.push(CurrentLocation);
    localStorage.setItem("Locations", JSON.stringify(Locations));
    LoadLocations();
    GetWeatherData(CurrentLocation);
  }
});

$(document).on('click','#RemoveLocationbtn',function(){
  var Locations = JSON.parse(localStorage.getItem("Locations"));
  if (Locations.includes(CurrentLocation) === true) {
    var id = Locations.indexOf(CurrentLocation);
    Locations.splice(id, 1);
    localStorage.setItem("Locations", JSON.stringify(Locations));
    LoadLocations();
    GetWeatherData(CurrentLocation);
  }
});

/// Load Defults ///
GetWeatherData('Denver');
LoadLocations();

// Clear storage function that is used for testing purposes when I need to clear the local storage.
// localStorage.clear()