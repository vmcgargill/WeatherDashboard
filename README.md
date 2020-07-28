# 06WeatherDashboard

In this assignment, I have constructed a weather dashboard app that obtains weather data from the Open Weather Map API. Open Weather is a open source API that is free. Here is the link:

https://openweathermap.org/

This weather dashboard app does the following: obtains corrent weather data for a given location which includes tempature, humidity, wind speed, and the current UV Index. This app also gets a 5 day forcast of the given location for the same time the user is viewing this data, which includes the date & time, the waether icon provided by OpenWeatherMap, the tempature of that day, and the humidity. The user can get weather data for any city in the entire world using this app. The user has the option of selecting from 20 different cities in the world. The user may also search for a city using the search bar. So if the user types in "Salt Lake City" and clicks on the search button, the app pulls the current weather data for Salt Lake City, UT. The search city by ID is unavalable in this app as it is not very user friendly to search for a city by id because the user would have to look up the city by ID. The search bar also features an autocomplete feature using JQuery's Autocomplete function. I had to create my own array to accomplish this however because you have to pay for the Google API. This array does have over 400 search results avalable of locations you can lookup. This includes all 50 states in the US, all of the state capitols, most of the big cities accross the world, and most countries as well. So the autocomplete won't guess everything. But it does have a lot to chose from, thus making the app more user friendly. 

## loadSuggestions(LocationArray)

## GetTodaysWeather(weatherURL)

## GetUVIndex(lat, lon)

## GetWeatherForecast(forecastURL)

## GetWeatherData(location)

## GetCordWeatherData()

## $(document).on('click','.city',function()

## $(document).on('click','#SearchLocation',function()

![weather dashboard](./Assets/weatherdashboardgifexample.gif)