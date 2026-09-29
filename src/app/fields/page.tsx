
"use client";

import { useState, type FormEvent } from "react";
import {
  CloudRain,
  Droplets,
  Loader2,
  MapPin,
  Search,
  Thermometer,
  Wind,
} from "lucide-react";
import AppShell from "@/components/AppShell";

type Day = {
  date: string;
  maximum: number;
  minimum: number;
  rainProbability: number;
  rainfall: number;
};

type Weather = {
  location: string;
  temperature: number;
  humidity: number;
  wind: number;
  rainfall: number;
  observedAt: string;
  days: Day[];
};

export default function FieldsPage() {
  const [city, setCity] = useState("Pune");
  const [weather, setWeather] = useState<Weather | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadWeather(event: FormEvent) {
    event.preventDefault();

    if (!city.trim()) {
      setError("Enter a city name.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      // Step 1: Convert the city name into coordinates.
      const geoResponse = await fetch(
        "https://geocoding-api.open-meteo.com/v1/search?" +
          new URLSearchParams({
            name: city.trim(),
            count: "5",
            language: "en",
            format: "json",
          })
      );

      if (!geoResponse.ok) {
        throw new Error("Location search failed.");
      }

      const geo = await geoResponse.json();
      const place = geo.results?.[0];

      if (!place) {
        throw new Error(
          "Location not found. Try a nearby major city."
        );
      }

      // Step 2: Retrieve live weather and forecast.
      const params = new URLSearchParams({
        latitude: String(place.latitude),
        longitude: String(place.longitude),
        current: [
          "temperature_2m",
          "relative_humidity_2m",
          "wind_speed_10m",
          "precipitation",
        ].join(","),
        daily: [
          "temperature_2m_max",
          "temperature_2m_min",
          "precipitation_probability_max",
          "precipitation_sum",
        ].join(","),
        forecast_days: "7",
        timezone: "auto",
      });

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?${params}`
      );

      if (!response.ok) {
        throw new Error("Could not retrieve weather.");
      }

      const data = await response.json();

      if (!data.current || !data.daily) {
        throw new Error("Incomplete weather response.");
      }

      const days: Day[] = data.daily.time.map(
        (date: string, index: number) => ({
          date,
          maximum:
            data.daily.temperature_2m_max[index],
          minimum:
            data.daily.temperature_2m_min[index],
          rainProbability:
            data.daily
              .precipitation_probability_max[index],
          rainfall:
            data.daily.precipitation_sum[index],
        })
      );

      setWeather({
        location: [
          place.name,
          place.admin1,
          place.country,
        ]
          .filter(Boolean)
          .join(", "),
        temperature: data.current.temperature_2m,
        humidity:
          data.current.relative_humidity_2m,
        wind: data.current.wind_speed_10m,
        rainfall: data.current.precipitation,
        observedAt: data.current.time,
        days,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load weather."
      );
    } finally {
      setLoading(false);
    }
  }

  const metrics = weather
    ? [
        {
          name: "Temperature",
          value: `${weather.temperature}°C`,
          icon: Thermometer,
        },
        {
          name: "Relative humidity",
          value: `${weather.humidity}%`,
          icon: Droplets,
        },
        {
          name: "Wind speed",
          value: `${weather.wind} km/h`,
          icon: Wind,
        },
        {
          name: "Current precipitation",
          value: `${weather.rainfall} mm`,
          icon: CloudRain,
        },
      ]
    : [];

  return (
    <AppShell
      title="Field Intelligence"
      subtitle="Local weather and field monitoring"
    >
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
            Weather intelligence
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Understand your field conditions
          </h2>

          <p className="mt-3 text-gray-500">
            Search for your field's nearest city
            to view current weather and a
            seven-day forecast.
          </p>
        </div>

        <form
          onSubmit={loadWeather}
          className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row"
        >
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-gray-200 px-4">
            <MapPin
              size={20}
              className="text-green-700"
            />

            <input
              value={city}
              onChange={(event) =>
                setCity(event.target.value)
              }
              placeholder="Enter city, e.g. Pune"
              className="w-full py-3 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#285943] px-6 py-3 font-semibold text-white disabled:opacity-60"
          >
            {loading ? (
              <Loader2
                size={19}
                className="animate-spin"
              />
            ) : (
              <Search size={19} />
            )}

            {loading ? "Loading..." : "Get weather"}
          </button>
        </form>

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 p-4 text-red-700"
          >
            {error}
          </p>
        )}

        {!weather && !loading && !error && (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <CloudRain
              size={42}
              className="mx-auto text-green-700"
            />

            <h3 className="mt-5 text-xl font-bold">
              Your field's weather starts here
            </h3>

            <p className="mt-2 text-gray-500">
              Click Get weather to load current
              conditions for {city || "your city"}.
            </p>
          </div>
        )}

        {weather && (
          <>
            <div className="rounded-2xl bg-[#285943] p-7 text-white">
              <p className="text-sm text-green-100">
                Selected location
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                {weather.location}
              </h3>

              <p className="mt-3 text-sm text-green-100">
                Latest weather update:{" "}
                {weather.observedAt.replace("T", " ")}
                {" "}local time
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric) => {
                const Icon = metric.icon;

                return (
                  <div
                    key={metric.name}
                    className="rounded-2xl border border-gray-200 bg-white p-6"
                  >
                    <Icon
                      size={27}
                      className="text-green-700"
                    />

                    <p className="mt-5 text-3xl font-bold">
                      {metric.value}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      {metric.name}
                    </p>
                  </div>
                );
              })}
            </div>

            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="text-xl font-bold">
                Seven-day weather forecast
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Forecast values may change as
                updated weather data becomes available.
              </p>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[550px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500">
                      <th className="pb-4">Day</th>
                      <th className="pb-4">High</th>
                      <th className="pb-4">Low</th>
                      <th className="pb-4">
                        Rain chance
                      </th>
                      <th className="pb-4">
                        Rainfall
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {weather.days.map((day) => (
                      <tr
                        key={day.date}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="py-4 font-semibold">
                          {new Date(
                            `${day.date}T12:00:00`
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            }
                          )}
                        </td>

                        <td className="py-4">
                          {day.maximum}°C
                        </td>

                        <td className="py-4">
                          {day.minimum}°C
                        </td>

                        <td className="py-4">
                          {day.rainProbability}%
                        </td>

                        <td className="py-4">
                          {day.rainfall} mm
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900">
              These are weather observations and
              forecasts for the selected location,
              not measurements from your actual
              field. They are not yet used by the
              CropSense disease classifier.
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}