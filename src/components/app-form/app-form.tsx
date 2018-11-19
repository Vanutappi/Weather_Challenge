import { Component, State } from '@stencil/core';

// What openweathermaps API response contains for 5 day forecast
interface weather_interface { // taken from https://openweathermap.org/forecast5
    
  city: {id: number, name: string},
  coord: {lon: number, lat: number},
  country: string,
  cod: number,
  message: number,
  cnt: number,
  list: [{
          dt: number,
          main: {
              temp: number,
              temp_min: number,
              temp_max: number,
              pressure: number,
              sea_level: number,
              grnd_level: number,
              humidity: number,
              temp_kf: number },
          weather: [{id: number, main: string, description: string, icon: string}],
          clouds: {all: number},
          wind: {speed: number, deg: number},
          sys: {pod: string},
          dt_txt: string
          }]
}

@Component({
  tag: 'app-form',
  styleUrl: 'app-form.css',
  shadow: true
})

export class AppForm {

  // city and country inputs from form
  @State() city: string; 
  //@State() country: string; 

  // holds all the weather data from API fetch
  @State() weather_data: weather_interface;

  // Toggle for showing weather data divs, at first false->hidden
  @State() toggle_data: boolean = false;

  // For handling time with parsing weather information in getWeather
  @State() now;
  @State() timestamp: number;
  
  // To get the number of forecasts in the current day, used for displaying the data correctly
  @State() counter: number = 0;

  // For collapsing weather days
  @State() collapses = [true,true,true,true,true,true]; 
  // I had to add this because changing the array values with collapses didnt trigger a re-render
  @State() render_trigger: boolean = true; 
  
  // Toggle function for collapsing days divs
  toggle(e:number) {
    // console.log(this.collapses[e])
    this.collapses[e] = !this.collapses[e]; // changing boolean to opposite
    this.render_trigger = !this.render_trigger; // just so the page re-renders
  }

  refreshPage(){
    this.toggle_data = false;
    window.location.reload();
  } 

  // For getting the weather information from openweathermap.org
  getWeather = async (e) => {
    
    e.preventDefault() // so site wont reload
    // my API key for openweathermap.org
    const API_KEY = "fa5b28bae9619e478e373fb84eab8f00";
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${this.city}&appid=${API_KEY}&units=metric`)
    .then(response => response.json())
    .then(data => {
      // giving the data to @State weather_data
      this.weather_data = data as weather_interface;
      // For showing the weather forecast divs after getting the data
      this.toggle_data = true;
      // console.log(this.weather_data);

      // getting unix timestamp for current days start
      this.now = new Date();
      var startOfDay = Date.UTC(this.now.getUTCFullYear(), this.now.getUTCMonth(), this.now.getUTCDate()); // start of day time
      this.timestamp = startOfDay / 1000; // Getting time formatted so I can compare later
      // Going through the data for a more useable 5 day forecast
      for (var i = 0; i < this.weather_data.cnt; i++){ // .cnt is how many members of .list[] came back with API, meaning forecasts
        // Getting how many forecasts are for current day for later handling
        if (this.weather_data.list[i].dt < (this.timestamp + 86400)){ // comparing time with current days starting time + days worth of seconds       
          this.counter++; // So its known how many forecasts came for the current day
        }
      }
    })
    .catch(console.error);
  }

  // Checking for validity for city
  handleChange(event) {
    this.city = event.target.value;
    if (event.target.validity.typeMismatch) {
      console.log('this element is not valid')
    }
  }

  render() {
    // this if-condition determines wether site loads form or the weather data
    if (this.toggle_data == false){ // if there is no weather data yet -> show the form
      return (
        <div class="form">
          <p>Please enter the city you'd like to know the weather of.</p>
          <form onSubmit={(e) => this.getWeather(e)}>
            <label>
              City:
              <input type="text" required value={this.city} onInput={(event) => this.handleChange(event)} />
            </label>
            <input class="Boxy" type="submit" value="Get weather" />         
          </form>
        </div>
      );
    } else { // else condition so we wont get typeset errors for calling weather_data object before it is gotten from API and for not showing form too
      // This will render the weather data for 5 days. Current and the next 4 days. If any extra forecasts are gotten for the 5th day, they are cut off
      return (
        <div> 
          <h1>Weather in {this.weather_data.city.name}.</h1>
          <p id="clicktxt">Click the boxes below for more detailed daily information.</p>

          <div id="header" onClick={this.toggle.bind(this,0)}>
            <span>At {this.weather_data.list[0].dt_txt} temp is {this.weather_data.list[0].main.temp} &#8451; and weather type is {this.weather_data.list[0].weather[0].description}.</span>
          </div>
          <div id="content" hidden={this.collapses[0]}>
            {this.weather_data.list.slice(0, this.counter).map((weather) =>
              <ul>
                <li>{weather.dt_txt}  ---  {weather.weather[0].description}</li>
                <li>Temp: {weather.main.temp} &#8451;  ---  Wind: {weather.wind.speed} m/s  ---  Humidity: {weather.main.humidity} %</li>
              </ul>
            )}
          </div>
          

          <div id="header" onClick={this.toggle.bind(this,1)}>
            <span>At {this.weather_data.list[this.counter+5].dt_txt} temp is {this.weather_data.list[this.counter+5].main.temp} &#8451; and weather type is {this.weather_data.list[this.counter+5].weather[0].description}.</span>
          </div>
          <div id="content" hidden={this.collapses[1]}>
                      
            {this.weather_data.list.slice(this.counter, this.counter+8).map((weather) =>
              <ul>
              <li>{weather.dt_txt}  ---  {weather.weather[0].description}</li>
              <li>Temp: {weather.main.temp} &#8451;  ---  Wind: {weather.wind.speed} m/s  ---  Humidity: {weather.main.humidity} %</li>
            </ul>
            )}
            
          </div> 

          <div id="header" onClick={this.toggle.bind(this,2)}>
            <span>At {this.weather_data.list[this.counter+5+8].dt_txt} temp is {this.weather_data.list[this.counter+5+8].main.temp} &#8451; and weather type is {this.weather_data.list[this.counter+5+8].weather[0].description}.</span>
          </div>
          <div id="content" hidden={this.collapses[2]}>
            
            {this.weather_data.list.slice(this.counter+8, this.counter+16).map((weather) =>
              <ul>
              <li>{weather.dt_txt}  ---  {weather.weather[0].description}</li>
              <li>Temp: {weather.main.temp} &#8451;  ---  Wind: {weather.wind.speed} m/s  ---  Humidity: {weather.main.humidity} %</li>
            </ul>
            )}
          </div> 

          <div id="header" onClick={this.toggle.bind(this,3)}>
            <span>At {this.weather_data.list[this.counter+5+16].dt_txt} temp is {this.weather_data.list[this.counter+5+16].main.temp} &#8451; and weather type is {this.weather_data.list[this.counter+5+16].weather[0].description}.</span>
          </div>
          <div id="content" hidden={this.collapses[3]}>
            
            {this.weather_data.list.slice(this.counter+16, this.counter+24).map((weather) =>
              <ul>
              <li>{weather.dt_txt}  ---  {weather.weather[0].description}</li>
              <li>Temp: {weather.main.temp} &#8451;  ---  Wind: {weather.wind.speed} m/s  ---  Humidity: {weather.main.humidity} %</li>
            </ul>
            )}
          </div> 
          
          <div id="header" onClick={this.toggle.bind(this,4)}>
            <span>At {this.weather_data.list[this.counter+5+24].dt_txt} temp is {this.weather_data.list[this.counter+5+24].main.temp} &#8451; and weather type is {this.weather_data.list[this.counter+5+24].weather[0].description}.</span>
          </div>
          <div id="content" hidden={this.collapses[4]}>
            
            {this.weather_data.list.slice(this.counter+24, this.counter+32).map((weather) =>
              <ul>
              <li>{weather.dt_txt}  ---  {weather.weather[0].description}</li>
              <li>Temp: {weather.main.temp} &#8451;  ---  Wind: {weather.wind.speed} m/s  ---  Humidity: {weather.main.humidity} %</li>
            </ul>
            )}
          </div>

          <button class="Boxy" type="submit" onClick={this.refreshPage.bind(this)}>Back to entering another city.</button>

        </div>
      );
    }
  }
} 