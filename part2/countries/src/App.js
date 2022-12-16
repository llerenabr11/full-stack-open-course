import { useState, useEffect } from "react";
import axios from "axios";

const WEATHER_API_KEY = process.env.REACT_APP_API_KEY;

const Filter = ({ onChangeHandler, filterValue }) => {
  return (
    <div>
      <p>find countries: </p>
      <input value={filterValue} onChange={onChangeHandler}></input>
    </div>
  );
};

const CountryList = ({ countryList, setFilterValue }) => {
  return (
    <ul>
      {countryList.map((country) => (
        <li key={country.name.common}>
          {country.name.common}
          <button
            onClick={() => {
              setFilterValue(country.name.common);
            }}
          >
            show
          </button>
        </li>
      ))}
    </ul>
  );
};

const CountryData = ({ country }) => {
  return (
    <div>
      <h3>{country.name.common}</h3>
      <p>capital: {country.capital[0]}</p>
      <p>area: {country.area}</p>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} />
      <CityWeatherData
        cityName={country.capital[0]}
        countryCode={country.cca2}
      ></CityWeatherData>
    </div>
  );
};

const CityWeatherData = ({ cityName, countryCode }) => {
  const [cityWeatherData, setCityWeatherData] = useState({});
  const [cityWeatherLoaded, setCityWeatherLoaded] = useState(false);

  useEffect(() => {
    axios
      .get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryCode}&limit=1&appid=${WEATHER_API_KEY}`
      )
      .then(
        (response) => {
          let lat = response.data[0].lat;
          let lon = response.data[0].lon;
          console.log(
            `Position data of the city ${cityName} loaded: lat: ${lat}, lon: ${lon}`
          );
          console.log(`Getting weather data of ${cityName}...`);
          axios
            .get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
            )
            .then(
              (response) => {
                let temperature = response.data.main.temp;
                let weatherIconSource = `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
                let wind = response.data.wind.speed;
                console.log(
                  `Weather data of ${cityName} loaded: temp: ${temperature}, wind: ${wind}, weatherIcon: ${weatherIconSource}`
                );
                setCityWeatherData({
                  temperature: temperature,
                  weatherIconSource: weatherIconSource,
                  wind: wind,
                });
                setCityWeatherLoaded(true);
              },
              (error) => {
                // error getting city weather data
                console.log(
                  `Unable to get city weather data of the city ${cityName}:`,
                  error
                );
              }
            );
        },
        (error) => {
          // error getting city position data
          console.log(
            `Unable to get position data of the city ${cityName}:`,
            error
          );
        }
      );
  }, []);

  if (cityWeatherLoaded) {
    return (
      <div>
        <h3>Weather in {cityName}</h3>
        <p>temperature: {cityWeatherData.temperature} Celcius</p>
        <img src={cityWeatherData.weatherIconSource} />
        <p>wind: {cityWeatherData.wind} m/s</p>
      </div>
    );
  } else {
    return <p>Loading weather data of {cityName}...</p>;
  }
};

const Country = ({ filterValue, countries, setFilterValue }) => {
  // filter countries by filterValue
  let filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filterValue.toLowerCase())
  );

  // Check if there is a complete match
  for (let i = 0; i < filteredCountries.length; i++) {
    if (
      filteredCountries[i].name.common.toLowerCase() ==
      filterValue.toLowerCase()
    ) {
      console.log(
        `Complete match in country name detected. Country: ${filteredCountries[i].name.common}`
      );
      filteredCountries = [filteredCountries[i]];
      break;
    }
  }

  if (filteredCountries.length > 10) {
    return <p>Too many matches, especify another filter</p>;
  } else if (filteredCountries.length > 1) {
    return (
      <CountryList
        countryList={filteredCountries}
        setFilterValue={setFilterValue}
      ></CountryList>
    );
  } else if (filteredCountries.length == 1) {
    let country = filteredCountries[0];
    return <CountryData country={country}></CountryData>;
  } else {
    return <p>No country match with the given filter</p>;
  }
};

function App() {
  const [filterValue, setFilterValue] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    console.log("Effect called: get countries");
    axios.get("https://restcountries.com/v3.1/all").then(
      (response) => {
        console.log("Promise fulfilled: countries loaded.");
        setCountries(response.data);
      },
      (error) =>
        console.log(
          `Unable to get countries from https://restcountries.com/v3.1/all: ${error}`
        )
    );
  }, []);

  const onChangeFilterHandler = (event) => {
    setFilterValue(event.target.value);
    console.log("filter value changed to: ", event.target.value);
  };

  return (
    <div>
      <Filter
        onChangeHandler={onChangeFilterHandler}
        filterValue={filterValue}
      ></Filter>
      <Country
        filterValue={filterValue}
        countries={countries}
        setFilterValue={setFilterValue}
      ></Country>
    </div>
  );
}

export default App;
