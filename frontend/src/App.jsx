import { useState } from "react";

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
      const res = await fetch(`/api/weather?city=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to fetch weather.");
        return;
      }

      setWeather(data);

      const forecastRes = await fetch(`/api/forecast?city=${encodeURIComponent(trimmed)}`);
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
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "system-ui, Arial" }}>
      <h1 style={{ marginBottom: 8 }}>Weather Forecast</h1>
      <p style={{ marginTop: 0, opacity: 0.75 }}>Search current weather by city.</p>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Try: London"
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <button style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ccc" }}>
          Search
        </button>
      </form>

      <div style={{ marginTop: 16 }}>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "crimson" }}>{error}</p>}

        {weather && (
          <div style={{ marginTop: 14, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
            <h2 style={{ marginTop: 0 }}>{weather.name}</h2>

            <p style={{ margin: "6px 0" }}>
              <strong>Temp:</strong> {Math.round(weather.main.temp)}°C (feels like{" "}
              {Math.round(weather.main.feels_like)}°C)
            </p>

            <p style={{ margin: "6px 0" }}>
              <strong>Condition:</strong> {weather.weather[0].description}
            </p>

            <p style={{ margin: "6px 0" }}>
              <strong>Humidity:</strong> {weather.main.humidity}%
            </p>

            <p style={{ margin: "6px 0" }}>
              <strong>Wind:</strong> {weather.wind.speed} m/s
            </p>
          </div>
        )}

        {forecast && (
          <div style={{ marginTop: 16 }}>
            <h3 style={{ marginBottom: 10 }}>5-Day Forecast</h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
              {forecast.days.map((day) => (
                <div
                  key={day.date}
                  style={{ padding: 12, border: "1px solid #ddd", borderRadius: 12 }}
                >
                  <strong>{day.date}</strong>
                  <p style={{ margin: "8px 0" }}>{Math.round(day.temp)}°C</p>
                  <p style={{ margin: 0, opacity: 0.8 }}>{day.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
