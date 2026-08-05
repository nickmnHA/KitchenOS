import { useEffect, useState } from "react";
import { useKitchenStore } from "../store/KitchenStore";

type HouseSnapshotProps = {
  onNavigate: (page: string) => void;
  greeting: string;
  date: string;
  todayEvents: string[];
};

type HealthLevel = "normal" | "attention" | "critical";

type HouseHealth = {
  level: HealthLevel;
  icon: string;
  title: string;
  detail: string;
  page?: string;
};

type WeatherData = {
  temperature: number;
  high: number;
  low: number;
  humidity: number;
  wind: number;
  condition: string;
  conditionCode: number;
  isDay: boolean;
};

type WeatherApiResponse = {
  current: {
    temp_f: number;
    humidity: number;
    wind_mph: number;
    is_day: number;
    condition: {
      text: string;
      code: number;
    };
  };
  forecast: {
    forecastday: Array<{
      day: {
        maxtemp_f: number;
        mintemp_f: number;
      };
    }>;
  };
};

const WEATHER_LOCATION = "North Branch, MN";

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getWeatherIcon(
  conditionCode: number,
  isDay: boolean,
) {
  if (conditionCode === 1000) {
    return isDay ? "☀️" : "🌙";
  }

  if (conditionCode === 1003) {
    return isDay ? "🌤️" : "☁️";
  }

  if ([1006, 1009].includes(conditionCode)) {
    return "☁️";
  }

  if ([1030, 1135, 1147].includes(conditionCode)) {
    return "🌫️";
  }

  if (
    [
      1063, 1150, 1153, 1168, 1171, 1180, 1183,
      1186, 1189, 1192, 1195, 1198, 1201, 1240,
      1243, 1246,
    ].includes(conditionCode)
  ) {
    return "🌧️";
  }

  if (
    [
      1066, 1069, 1072, 1114, 1117, 1204, 1207,
      1210, 1213, 1216, 1219, 1222, 1225, 1237,
      1249, 1252, 1255, 1258, 1261, 1264,
    ].includes(conditionCode)
  ) {
    return "❄️";
  }

  if (
    [1087, 1273, 1276, 1279, 1282].includes(
      conditionCode,
    )
  ) {
    return "⛈️";
  }

  return "🌡️";
}

function getWeatherAnimationClass(
  conditionCode: number,
  isDay: boolean,
) {
  if (conditionCode === 1000) {
    return isDay ? "sunny" : "clear-night";
  }

  if ([1003, 1006, 1009].includes(conditionCode)) {
    return "cloudy";
  }

  if ([1030, 1135, 1147].includes(conditionCode)) {
    return "fog";
  }

  if (
    [
      1063, 1150, 1153, 1168, 1171, 1180, 1183,
      1186, 1189, 1192, 1195, 1198, 1201, 1240,
      1243, 1246,
    ].includes(conditionCode)
  ) {
    return "rain";
  }

  if (
    [
      1066, 1069, 1072, 1114, 1117, 1204, 1207,
      1210, 1213, 1216, 1219, 1222, 1225, 1237,
      1249, 1252, 1255, 1258, 1261, 1264,
    ].includes(conditionCode)
  ) {
    return "snow";
  }

  if (
    [1087, 1273, 1276, 1279, 1282].includes(
      conditionCode,
    )
  ) {
    return "storm";
  }

  return "cloudy";
}

function HouseSnapshot({
  onNavigate,
  greeting,
  date,
  todayEvents,
}: HouseSnapshotProps) {
  const { chores } = useKitchenStore();

  const [weather, setWeather] =
    useState<WeatherData | null>(null);

  const [weatherLoading, setWeatherLoading] =
    useState(true);

  const [weatherError, setWeatherError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadWeather() {
      const apiKey = import.meta.env
        .VITE_WEATHER_API_KEY as string | undefined;

      if (!apiKey) {
        setWeatherError("Weather API key is missing");
        setWeatherLoading(false);
        return;
      }

      try {
        const params = new URLSearchParams({
          key: apiKey,
          q: WEATHER_LOCATION,
          days: "1",
          aqi: "no",
          alerts: "no",
        });

        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?${params}`,
        );

        if (!response.ok) {
          throw new Error(
            `Weather request failed: ${response.status}`,
          );
        }

        const data =
          (await response.json()) as WeatherApiResponse;

        const todayForecast =
          data.forecast.forecastday[0];

        if (!todayForecast) {
          throw new Error("Forecast data is missing");
        }

        if (cancelled) {
          return;
        }

        setWeather({
          temperature: Math.round(data.current.temp_f),
          high: Math.round(
            todayForecast.day.maxtemp_f,
          ),
          low: Math.round(
            todayForecast.day.mintemp_f,
          ),
          humidity: Math.round(data.current.humidity),
          wind: Math.round(data.current.wind_mph),
          condition: data.current.condition.text,
          conditionCode: data.current.condition.code,
          isDay: data.current.is_day === 1,
        });

        setWeatherError("");
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(error);
        setWeatherError("Weather unavailable");
      } finally {
        if (!cancelled) {
          setWeatherLoading(false);
        }
      }
    }

    loadWeather();

    const refreshTimer = window.setInterval(
      loadWeather,
      15 * 60 * 1000,
    );

    return () => {
      cancelled = true;
      window.clearInterval(refreshTimer);
    };
  }, []);

  const todayKey = getDateKey(new Date());

  const remainingChores = chores.filter(
    (chore) => !chore.completed,
  );

  const overdueChores = remainingChores.filter(
    (chore) =>
      chore.dueDate &&
      chore.dueDate < todayKey,
  );

  const choresDueToday = remainingChores.filter(
    (chore) => chore.dueDate === todayKey,
  );

  let houseHealth: HouseHealth = {
    level: "normal",
    icon: "🏠",
    title: "House Healthy",
    detail: "Everything looks normal",
  };

  if (choresDueToday.length > 0) {
    houseHealth = {
      level: "attention",
      icon: "🧹",
      title:
        choresDueToday.length === 1
          ? "1 chore due today"
          : `${choresDueToday.length} chores due today`,
      detail: "Tap to review",
      page: "chores",
    };
  }

  if (overdueChores.length > 0) {
    houseHealth = {
      level: "critical",
      icon: "⚠️",
      title:
        overdueChores.length === 1
          ? "1 overdue chore"
          : `${overdueChores.length} overdue chores`,
      detail: "Needs attention",
      page: "chores",
    };
  }

  const healthClass =
    houseHealth.level === "critical"
      ? "danger"
      : houseHealth.level === "attention"
        ? "warning"
        : "success";

  const healthTile = (
    <>
      <span className="status-pill-icon">
        {houseHealth.icon}
      </span>

      <span>
        <strong>{houseHealth.title}</strong>
        <small>{houseHealth.detail}</small>
      </span>
    </>
  );

  const weatherClass = weather
    ? `weather-${getWeatherAnimationClass(
        weather.conditionCode,
        weather.isDay,
      )}`
    : "";

  return (
    <section
      className={`house-snapshot house-health-${houseHealth.level} ${weatherClass}`}
    >
      <div className="snapshot-header">
        <p className="eyebrow">{date}</p>

        <h2 className="hero-title">
          {greeting},{" "}
          <span className="hero-name">Nick</span>
        </h2>
      </div>

      <div className="snapshot-grid">
        <div className="snapshot-card">
          <span className="snapshot-label">
            Today
          </span>

          {todayEvents.length > 0 ? (
            <>
              {todayEvents
                .slice(0, 3)
                .map((event, index) => (
                  <button
                    key={`${event}-${index}`}
                    type="button"
                    className="snapshot-link"
                    onClick={() =>
                      onNavigate("calendar")
                    }
                  >
                    {event}
                  </button>
                ))}

              {todayEvents.length > 3 && (
                <p className="snapshot-more">
                  +{todayEvents.length - 3} more
                </p>
              )}
            </>
          ) : (
            <p className="snapshot-more">
              Nothing scheduled
            </p>
          )}
        </div>

        <div className="snapshot-card snapshot-weather-column">
          <span className="snapshot-label">
            Weather
          </span>

          <div
            className={`snapshot-weather weather-feature ${weatherClass}`}
          >
            <div
              className="weather-effects"
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            {weatherLoading && (
              <div className="weather-desc">
                Loading weather...
              </div>
            )}

            {!weatherLoading && weatherError && (
              <div className="weather-desc">
                {weatherError}
              </div>
            )}

            {!weatherLoading &&
              !weatherError &&
              weather && (
                <>
                  <div className="weather-feature-content">
                    <div className="weather-feature-primary">
                      <div className="weather-current">
                        <span className="weather-icon">
                          {getWeatherIcon(
                            weather.conditionCode,
                            weather.isDay,
                          )}
                        </span>
                      </div>

                      <div className="weather-temp">
                        {weather.temperature}°
                      </div>

                      <strong className="weather-condition">
                        {weather.condition}
                      </strong>
                    </div>

                    <div className="weather-feature-stats">
                      <div>
                        <span>High</span>
                        <strong>{weather.high}°</strong>
                      </div>

                      <div>
                        <span>Low</span>
                        <strong>{weather.low}°</strong>
                      </div>

                      <div>
                        <span>Humidity</span>
                        <strong>
                          {weather.humidity}%
                        </strong>
                      </div>

                      <div>
                        <span>Wind</span>
                        <strong>
                          {weather.wind} mph
                        </strong>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="weather-forecast-link"
                    onClick={() =>
                      onNavigate("weather")
                    }
                  >
                    <span>View full forecast</span>
                    <span aria-hidden="true">›</span>
                  </button>
                </>
              )}
          </div>
        </div>

        <div className="snapshot-card">
          <span className="snapshot-label">
            House Health
          </span>

          <div className="snapshot-status">
            {houseHealth.page ? (
              <button
                type="button"
                className={`status-pill ${healthClass} status-pill-priority`}
                onClick={() =>
                  onNavigate(houseHealth.page!)
                }
              >
                {healthTile}
              </button>
            ) : (
              <div
                className={`status-pill ${healthClass} status-pill-priority`}
              >
                {healthTile}
              </div>
            )}

            <div className="status-pill">
              <span className="status-pill-icon">
                🌡️
              </span>
              <span>Inside 72°</span>
            </div>

            <div className="status-pill">
              <span className="status-pill-icon">
                🚪
              </span>
              <span>Garage Closed</span>
            </div>

            <div className="status-pill">
              <span className="status-pill-icon">
                🔒
              </span>
              <span>Front Door Locked</span>
            </div>

            <div className="status-pill">
              <span className="status-pill-icon">
                💡
              </span>
              <span>8 Lights On</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HouseSnapshot;