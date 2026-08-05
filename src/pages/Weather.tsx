import { useEffect, useState } from "react";

type WeatherProps = {
  onNavigate: (page: string) => void;
};

type ForecastDay = {
  date: string;
  day: {
    maxtemp_f: number;
    mintemp_f: number;
    avgtemp_f: number;
    maxwind_mph: number;
    avghumidity: number;
    daily_chance_of_rain: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
  };
  astro: {
    sunrise: string;
    sunset: string;
  };
};

type WeatherApiResponse = {
  location: {
    name: string;
    region: string;
  };
  forecast: {
    forecastday: ForecastDay[];
  };
};

const WEATHER_LOCATION = "North Branch, MN";

function formatForecastDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function Weather({ onNavigate }: WeatherProps) {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadForecast() {
      const apiKey = import.meta.env
        .VITE_WEATHER_API_KEY as string | undefined;

      if (!apiKey) {
        setError("Weather API key is missing.");
        setLoading(false);
        return;
      }

      try {
        const params = new URLSearchParams({
          key: apiKey,
          q: WEATHER_LOCATION,
          days: "7",
          aqi: "no",
          alerts: "no",
        });

        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?${params}`,
        );

        if (!response.ok) {
          throw new Error(
            `Forecast request failed: ${response.status}`,
          );
        }

        const data =
          (await response.json()) as WeatherApiResponse;

        if (cancelled) {
          return;
        }

        setForecast(data.forecast.forecastday);
        setLocationName(
          `${data.location.name}, ${data.location.region}`,
        );
        setError("");
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        console.error(requestError);
        setError("Forecast unavailable.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadForecast();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="main weather-page">
      <div className="weather-page-header">
        <div>
          <p className="eyebrow">Weather</p>
          <h2>Weekly Forecast</h2>
          <p>{locationName}</p>
        </div>

        <button
          type="button"
          className="weather-back-button"
          onClick={() => onNavigate("home")}
        >
          ← Back Home
        </button>
      </div>

      {loading && (
        <section className="forecast-message">
          Loading forecast...
        </section>
      )}

      {!loading && error && (
        <section className="forecast-message">
          {error}
        </section>
      )}

      {!loading && !error && (
        <section className="forecast-grid">
          {forecast.map((day) => (
            <article
              key={day.date}
              className="forecast-day-card"
            >
              <div className="forecast-day-heading">
                <div>
                  <strong>
                    {formatForecastDate(day.date)}
                  </strong>

                  <span>{day.day.condition.text}</span>
                </div>

                <img
                  src={`https:${day.day.condition.icon}`}
                  alt=""
                />
              </div>

              <div className="forecast-temperatures">
                <strong>
                  {Math.round(day.day.maxtemp_f)}°
                </strong>

                <span>
                  {Math.round(day.day.mintemp_f)}°
                </span>
              </div>

              <div className="forecast-details">
                <div>
                  <span>Rain</span>
                  <strong>
                    {day.day.daily_chance_of_rain}%
                  </strong>
                </div>

                <div>
                  <span>Humidity</span>
                  <strong>
                    {Math.round(day.day.avghumidity)}%
                  </strong>
                </div>

                <div>
                  <span>Wind</span>
                  <strong>
                    {Math.round(day.day.maxwind_mph)} mph
                  </strong>
                </div>

                <div>
                  <span>Sunrise</span>
                  <strong>{day.astro.sunrise}</strong>
                </div>

                <div>
                  <span>Sunset</span>
                  <strong>{day.astro.sunset}</strong>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Weather;