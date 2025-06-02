import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");
  const [recentCities, setRecentCities] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "6a56952c42ce7399b6f84aebc011b7bd"; // Replace with your own key

  // Load recent cities from localStorage once on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentCities")) || [];
    setRecentCities(stored);
  }, []);

  // Update recent cities and fetch weather on search change
  useEffect(() => {
    if (!search) return;

    // Use functional state update to avoid adding recentCities to deps
    setRecentCities((prevCities) => {
      const updated = [search, ...prevCities.filter((c) => c !== search)].slice(0, 5);
      localStorage.setItem("recentCities", JSON.stringify(updated));
      return updated;
    });

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

  // Convert sunrise/sunset UNIX timestamps to readable time
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString();
  };

  return (
    <div className={`App ${darkMode ? "dark" : "light"}`}>
      <h1>🌤️ Weather App</h1>

      <button onClick={() => setDarkMode(!darkMode)} style={{ marginBottom: "10px" }}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ padding: "8px", width: "200px", marginRight: "8px" }}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {recentCities.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <strong>Recent Searches:</strong>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {recentCities.map((item, index) => (
              <li key={index}>
                <button onClick={() => handleRecentClick(item)}>{item}</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        {loading && <p>Loading weather...</p>}
        {error && <p>{error}</p>}
        {data && (
          <div
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              borderRadius: "10px",
              maxWidth: "400px",
              margin: "auto",
              backgroundColor: darkMode ? "#333" : "#f9f9f9",
            }}
          >
            <h2>
              {data.name}, {data.sys.country}
            </h2>
            <img
              src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt={data.weather[0].description}
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
    </div>
  );
}

export default App;
