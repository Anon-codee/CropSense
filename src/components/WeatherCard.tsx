
import {
  CloudSun,
  Droplets,
  Thermometer,
  Wind,
} from "lucide-react";

export default function WeatherCard() {
  return (
    <section className="rounded-2xl border border-[#e5e9df] bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">
            Field weather
          </p>

          <h2 className="mt-1 text-xl font-bold">
            Weather overview
          </h2>
        </div>

        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          Sample data
        </span>
      </div>

      <div className="mt-7 flex items-center gap-4">
        <CloudSun
          size={54}
          className="text-amber-500"
          strokeWidth={1.5}
        />

        <div>
          <p className="text-4xl font-bold">29°C</p>
          <p className="mt-1 text-sm text-gray-500">
            Illustrative conditions
          </p>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-3 gap-3 border-t border-gray-100 pt-6">
        <div>
          <Droplets className="mb-2 text-blue-500" size={20} />
          <p className="font-semibold">68%</p>
          <p className="text-xs text-gray-500">Humidity</p>
        </div>

        <div>
          <Thermometer
            className="mb-2 text-orange-500"
            size={20}
          />
          <p className="font-semibold">29°C</p>
          <p className="text-xs text-gray-500">Temperature</p>
        </div>

        <div>
          <Wind className="mb-2 text-green-600" size={20} />
          <p className="font-semibold">12 km/h</p>
          <p className="text-xs text-gray-500">Wind</p>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-gray-400">
        Demonstration values only. Live local weather
        integration is not connected yet.
      </p>
    </section>
  );
}