import React, { useState } from 'react';
import './App.css';

// The main App component that contains all the logic and UI
const App = () => {
  // State for the city input fielde
  const [city, setCity] = useState('');
  // State to hold the weather data
  const [weatherData, setWeatherData] = useState(null);
  // State for loading status
  const [loading, setLoading] = useState(false);
  // State for error messages
  const [error, setError] = useState(null);

  // IMPORTANT: Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
  const API_KEY = '31c11340d83169cb540f63f7511358d6';
  const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  // Function to fetch weather data from the API
  const fetchWeather = async () => {
    // Basic validation to check if the city input is not empty
    if (!city.trim()) {
      setError('Please enter a city name.');
      return;
    }
    
    // Clear previous weather data and errors, set loading to true
    setWeatherData(null);
    setError(null);
    setLoading(true);

    try {
      // Construct the full API URL with the city, API key, and units
      const response = await fetch(`${API_BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
      
      // Check for a successful response (status code 200)
      if (!response.ok) {
        // Throw an error if the city is not found or other API issues occur
        throw new Error('City not found. Please try again.');
      }

      // Parse the JSON data from the response
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      // Catch and set the error state
      setError(err.message);
    } finally {
      // Set loading to false once the fetch is complete (success or failure)
      setLoading(false);
    }
  };

  // Helper function to get the weather icon URL
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };
  
  // Handles the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  // Helper function to format Unix timestamp to a readable time.
  // The timestamp is already localized by the API, so no timezone offset is needed here.
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleTimeString('en-US', options);
  };

  return (
    <>

      <div className="weather-container">
        <div className="weather-card">
          <h1 className="weather-title">Weather Forecast</h1>
          
          <form onSubmit={handleSubmit} className="search-form">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              className="city-input"
            />
            <button
              type="submit"
              className="search-button"
            >
              Get Weather
            </button>
          </form>

          {/* Display a loading message while fetching data */}
          {loading && <p className="loading-message">Loading...</p>}

          {/* Display an error message if something goes wrong */}
          {error && <p className="error-message">{error}</p>}

          {/* Display weather data if available */}
          {weatherData && (
            <div className="weather-info">
              <h2 className="weather-city">
                {weatherData.name}, {weatherData.sys.country}
              </h2>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img
                  src={getWeatherIcon(weatherData.weather[0].icon)}
                  alt={weatherData.weather[0].description}
                  style={{ width: '6rem', height: '6rem' }}
                />
              </div>
              <p className="weather-temp">
                {Math.round(weatherData.main.temp)}°C
              </p>
              <p className="weather-desc">
                {weatherData.weather[0].description}
              </p>
              <div className="details-grid">
                <div className="detail-item">
                  <p>Feels Like</p>
                  <p>{Math.round(weatherData.main.feels_like)}°C</p>
                </div>
                <div className="detail-item">
                  <p>Humidity</p>
                  <p>{weatherData.main.humidity}%</p>
                </div>
                <div className="detail-item">
                  <p>Wind Speed</p>
                  <p>{weatherData.wind.speed} m/s</p>
                </div>
                <div className="detail-item">
                  <p>Pressure</p>
                  <p>{weatherData.main.pressure} hPa</p>
                </div>
              </div>

              {/* Additional details section for the full API data */}
              <div className="additional-details">
                <div className="additional-detail-item sunrise">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p>Sunrise</p>
                    <p>{formatTime(weatherData.sys.sunrise)}</p>
                  </div>
                </div>
                <div className="additional-detail-item sunset">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p>Sunset</p>
                    <p>{formatTime(weatherData.sys.sunset)}</p>
                  </div>
                </div>
                <div className="additional-detail-item visibility">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p>Visibility</p>
                    <p>{weatherData.visibility / 1000} km</p>
                  </div>
                </div>
                <div className="additional-detail-item wind-direction">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p>Wind Direction</p>
                    <p>{weatherData.wind.deg}°</p>
                  </div>
                </div>
                <div className="additional-detail-item cloudiness">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p>Cloudiness</p>
                    <p>{weatherData.clouds.all}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer with a note about the API */}
        <footer className="footer">
          Powered by <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>OpenWeatherMap API</a>
        </footer>
      </div>
    </>
  );
};

export default App;
