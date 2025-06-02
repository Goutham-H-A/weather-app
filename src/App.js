import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Footer from "./Footer";

function App() {
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");
  const [recentCities, setRecentCities] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "6a56952c42ce7399b6f84aebc011b7bd"; // Replace with your own key

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentCities")) || [];
    setRecentCities(stored);
  }, []);

  useEffect(() => {
    if (!search) return;
    const updated = [search, ...recentCities.filter((c) => c !== search)].slice(0, 5);
    setRecentCities(updated);
    localStorage.setItem("recentCities", JSON.stringify(updated));
    fetchWeather(search);
  }, [search]);

  const handleSearch = () => {
    if (city.trim() !== "") {
      setSearch(city.trim());
    }
  };

  const handleRecentClick = (name) => {
    setCity(name);
    setSearch(name);
  };

  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      setData(response.data);
    } catch (err) {
      setError("City not found or API error");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString();
  };

  return (
    <div className={`App ${darkMode ? "dark" : "light"}`}>
      <h1>🌤️ Weather App</h1>

      <button className="mode-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="search-container">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="city-input"
          onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
        />
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>

      {recentCities.length > 0 && (
        <div className="recent-searches">
          <strong>Recent Searches:</strong>
          <ul>
            {recentCities.map((item, index) => (
              <li key={index}>
                <button className="recent-button" onClick={() => handleRecentClick(item)}>
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="weather-info">
        {loading && <p>Loading weather...</p>}
        {error && <p className="error">{error}</p>}
        {data && (
          <div className="weather-box">
            <h2>{data.name}, {data.sys.country}</h2>
            <img
              src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt={data.weather[0].description}
              className="weather-icon"
            />
            <p>🌡️ Temp: {data.main.temp} °C</p>
            <p>🌡️ Feels Like: {data.main.feels_like} °C</p>
            <p>💧 Humidity: {data.main.humidity}%</p>
            <p>🌬️ Wind: {data.wind.speed} m/s</p>
            <p>🔵 Pressure: {data.main.pressure} hPa</p>
            <p>🌥️ Condition: {data.weather[0].description}</p>
            <p>🌅 Sunrise: {formatTime(data.sys.sunrise)}</p>
            <p>🌇 Sunset: {formatTime(data.sys.sunset)}</p>
          </div>
        )}
      </div>
      <Footer />

    </div>
  );
}

export default App;
