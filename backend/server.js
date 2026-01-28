import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: "City is required" });

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing OPENWEATHER_API_KEY in .env" });

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      // send back OpenWeather’s actual status + message
      return res.status(response.status).json({
        error: data?.message || "OpenWeather request failed",
        details: data,
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/forecast", async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: "City is required" });

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing OPENWEATHER_API_KEY" });

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data?.message || "Forecast failed" });
    }

    // Pick one item per day (around midday when possible)
    const byDate = {};
    for (const item of data.list) {
      const date = item.dt_txt.split(" ")[0];
      const hour = item.dt_txt.split(" ")[1]; // "12:00:00"
      // Prefer 12:00:00; otherwise keep the first item seen for that date
      if (!byDate[date] || hour === "12:00:00") {
        byDate[date] = item;
      }
    }

    const days = Object.entries(byDate)
      .slice(0, 5)
      .map(([date, item]) => ({
        date,
        temp: item.main.temp,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      }));

    res.json({ city: data.city.name, days });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/api/forecast", async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: "City is required" });

    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message });
    }

    // Group forecast by day
    const daily = {};
    data.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!daily[date]) daily[date] = item;
    });

    res.json({
      city: data.city.name,
      days: Object.values(daily).slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
