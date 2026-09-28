
"use client";

import {
  CloudRain,
  Droplets,
  ThermometerSun,
  Sprout,
  Info,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import WeatherCard from "@/components/WeatherCard";

const weather = [
  { day: "Mon", temperature: 28, rainfall: 2 },
  { day: "Tue", temperature: 30, rainfall: 0 },
  { day: "Wed", temperature: 29, rainfall: 12 },
  { day: "Thu", temperature: 27, rainfall: 18 },
  { day: "Fri", temperature: 29, rainfall: 4 },
  { day: "Sat", temperature: 31, rainfall: 0 },
  { day: "Sun", temperature: 30, rainfall: 1 },
];

export default function FieldsPage() {
  return (
    <AppShell
      title="Field Intelligence"
      subtitle="Understand the conditions surrounding your crops"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold">
          Environmental Overview
        </h2>

        <p className="mt-3 text-gray-500">
          Weather and field observations provide additional
          evidence for investigating crop stress.
        </p>
      </div>

      <div className="mb-7 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
        <Info size={22} className="shrink-0" />

        <p className="text-sm leading-relaxed">
          This page currently uses illustrative weather
          values. Live forecasts and historical observations
          will be available after API integration.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <WeatherCard />

        <div className="rounded-2xl border border-[#e5e9df] bg-white p-6 lg:col-span-2">
          <h3 className="text-xl font-bold">
            Example 7-Day Weather
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Synthetic values for interface development
          </p>

          <div className="mt-9 flex h-56 items-end justify-between gap-3">
            {weather.map((day) => (
              <div
                key={day.day}
                className="flex h-full flex-1 flex-col items-center justify-end"
              >
                <p className="mb-2 text-xs font-semibold">
                  {day.temperature}°
                </p>

                <div
                  className="w-full max-w-12 rounded-t-lg bg-[#74a783]"
                  style={{
                    height: `${day.temperature * 4}px`,
                  }}
                />

                <p className="mt-3 text-xs font-medium text-gray-500">
                  {day.day}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
            <span className="h-3 w-3 rounded bg-[#74a783]" />
            Example daily temperature (°C)
          </div>
        </div>
      </div>

      <h3 className="mt-10 text-2xl font-bold">
        Environmental Indicators
      </h3>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {[
          {
            title: "Rainfall",
            value: "37 mm",
            description: "Example weekly total",
            icon: CloudRain,
          },
          {
            title: "Air Temperature",
            value: "29°C",
            description: "Example conditions",
            icon: ThermometerSun,
          },
          {
            title: "Humidity",
            value: "68%",
            description: "Example relative humidity",
            icon: Droplets,
          },
        ].map((indicator) => {
          const Icon = indicator.icon;

          return (
            <div
              key={indicator.title}
              className="rounded-2xl border border-[#e5e9df] bg-white p-6"
            >
              <Icon size={26} className="text-green-700" />

              <h4 className="mt-5 text-sm text-gray-500">
                {indicator.title}
              </h4>

              <p className="mt-2 text-3xl font-bold">
                {indicator.value}
              </p>

              <p className="mt-2 text-sm text-gray-400">
                {indicator.description}
              </p>
            </div>
          );
        })}
      </div>

      <section className="mt-9 rounded-2xl bg-[#e9f1e6] p-7">
        <div className="flex items-center gap-3">
          <Sprout size={27} className="text-green-700" />

          <h3 className="text-xl font-bold">
            Why field context matters
          </h3>
        </div>

        <p className="mt-4 max-w-3xl leading-relaxed text-gray-600">
          Similar leaf symptoms can have different causes.
          Recent rainfall, irrigation history, temperature
          and soil observations help determine which causes
          need further investigation.
        </p>
      </section>
    </AppShell>
  );
}