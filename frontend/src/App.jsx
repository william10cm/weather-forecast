import { useState } from "react";
import "./App.css";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export default function App() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = city.trim();
    setError("");
    setWeather(null);
    setForecast(null);


    if (!trimmed) {
      setError("Please enter a city.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/weather?city=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to fetch weather.");
        return;
      }

      setWeather(data);

      const forecastRes = await fetch(`${API_BASE_URL}/api/forecast?city=${encodeURIComponent(trimmed)}`);
      const forecastData = await forecastRes.json();

      if (!forecastRes.ok) {
        setError(forecastData?.error || "Failed to fetch forecast.");
        return;
      }

      setForecast(forecastData);
    } catch (err) {
      setError("Network error. Is the backend running on http://localhost:5000 ?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-app">
      <h1 className="weather-app-title">Weather Forecast</h1>
      <p className="weather-app-subtitle">Search current weather by city.</p>

      <form onSubmit={handleSubmit} className="weather-form">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Try: London"
          className="weather-input"
        />
        <button className="weather-button">
          Search
        </button>
      </form>

      <div className="weather-results">
        {loading && <p>Loading...</p>}
        {error && <p className="weather-error">{error}</p>}

        {weather && (
          <div className="weather-card">
            <h2 className="weather-city">{weather.name}</h2>

            <p className="weather-row">
              <strong>Temp:</strong> {Math.round(weather.main.temp)}°C (feels like{" "}
              {Math.round(weather.main.feels_like)}°C)
            </p>

            <p className="weather-row">
              <strong>Condition:</strong> {weather.weather[0].description}
            </p>

            <p className="weather-row">
              <strong>Humidity:</strong> {weather.main.humidity}%
            </p>

            <p className="weather-row">
              <strong>Wind:</strong> {weather.wind.speed} m/s
            </p>
          </div>
        )}

        {forecast && (
          <div className="forecast-section">
            <h3 className="forecast-title">5-Day Forecast</h3>

            <div className="forecast-grid">
              {forecast.days.map((day) => (
                <div
                  key={day.date}
                  className="forecast-card"
                >
                  <strong>{day.date}</strong>
                  <p className="forecast-temp">{Math.round(day.temp)}°C</p>
                  <p className="forecast-description">{day.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
