import { Card, CardContent } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";
import type { WeatherData, GeocodingResponse } from "@/api/types";

interface CurrentWeatherProps {
  data: WeatherData;
  locationName?: GeocodingResponse;
}

export function CurrentWeather({ data, locationName }: CurrentWeatherProps) {
  const {
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed },
  } = data;

  // Format temperature
  const formatTemp = (temp: number) => `${Math.round(temp)}°`;

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl border">
      <CardContent className="p-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Location and Temperature Details */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                {locationName?.name}
                {locationName?.state && (
                  <span className="text-lg text-gray-500">
                    , {locationName.state}
                  </span>
                )}
              </h2>
              <p className="text-base text-gray-500">{locationName?.country}</p>
            </div>

            <div className="flex items-center gap-3">
              <p className="text-7xl font-extrabold tracking-tighter text-gray-900">
                {formatTemp(temp)}
              </p>
              <div className="space-y-1">
                <p className="text-lg font-medium text-gray-600">
                  Feels like {formatTemp(feels_like)}
                </p>
                <div className="flex gap-3 text-lg font-semibold">
                  <span className="flex items-center gap-1 text-blue-600">
                    <ArrowDown className="h-4 w-4" />
                    {formatTemp(temp_min)}
                  </span>
                  <span className="flex items-center gap-1 text-red-600">
                    <ArrowUp className="h-4 w-4" />
                    {formatTemp(temp_max)}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Weather Info */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-md">
                <Droplets className="h-5 w-5 text-blue-600" />
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-gray-700">Humidity</p>
                  <p className="text-sm text-gray-600">{humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-md">
                <Wind className="h-5 w-5 text-blue-600" />
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-gray-700">Wind Speed</p>
                  <p className="text-sm text-gray-600">{speed} m/s</p>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Icon & Description */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative flex aspect-square w-full max-w-[220px] items-center justify-center">
              <img
                src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
                alt={currentWeather.description}
                className="h-full w-full object-contain drop-shadow-lg"
              />
              <div className="absolute bottom-0 text-center bg-white/80 px-3 py-1 rounded-md shadow-md">
                <p className="text-sm font-semibold capitalize text-gray-800">
                  {currentWeather.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
