import { useState } from "react";

export default function App() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = city.trim();
    setError("");
    setWeather(null);

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
      </div>
    </div>
  );
}
