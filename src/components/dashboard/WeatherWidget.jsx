import { Card } from "@/components/ui/card"
import { useEffect, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

const getWeatherEmoji = (code) => {
  // WMO Weather interpretation codes (WW)
  // https://open-meteo.com/en/docs
  const weatherCodes = {
    0: '☀️',  // Clear sky
    1: '🌤️', // Mainly clear
    2: '⛅', // Partly cloudy
    3: '☁️', // Overcast
    45: '🌫️', // Foggy
    48: '🌫️', // Depositing rime fog
    51: '🌧️', // Light drizzle
    53: '🌧️', // Moderate drizzle
    55: '🌧️', // Dense drizzle
    61: '🌧️', // Slight rain
    63: '🌧️', // Moderate rain
    65: '🌧️', // Heavy rain
    71: '🌨️', // Slight snow
    73: '🌨️', // Moderate snow
    75: '🌨️', // Heavy snow
    77: '🌨️', // Snow grains
    80: '🌧️', // Slight rain showers
    81: '🌧️', // Moderate rain showers
    82: '🌧️', // Violent rain showers
    85: '🌨️', // Slight snow showers
    86: '🌨️', // Heavy snow showers
    95: '⛈️', // Thunderstorm
    96: '⛈️', // Thunderstorm with slight hail
    99: '⛈️'  // Thunderstorm with heavy hail
  };
  return weatherCodes[code] || '☀️';
};

export function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [usingGPS, setUsingGPS] = useState(false);
  const fetchWeather = async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsRefreshing(true);
    }
    setLoading(true);
    
    try {
      let locationData;
      
      // Try to get GPS location first if not already tried
      if (!usingGPS || forceRefresh) {
        locationData = await getLocationData();
        setUsingGPS(!!locationData);
      }

      // Fall back to IP-based location if GPS failed or was denied
      if (!locationData) {
        try {
          const geoResponse = await fetch('https://ipapi.co/json/');
          const ipData = await geoResponse.json();
          
          if (ipData && ipData.latitude && ipData.longitude) {
            locationData = {
              lat: ipData.latitude,
              lon: ipData.longitude,
              city: ipData.city || 'Your Location'
            };
          } else {
            // Fallback to a default location if IP geolocation fails
            locationData = {
              lat: 40.7128, // New York
              lon: -74.0060,
              city: 'Default Location'
            };
          }
        } catch (ipError) {
          console.error('IP geolocation failed:', ipError);
          // Use default location as last resort
          locationData = {
            lat: 40.7128, // New York
            lon: -74.0060,
            city: 'Default Location'
          };
        }
      }

      // Get weather data
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${locationData.lat}&longitude=${locationData.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,pressure_msl,weather_code`
      );
      const weatherData = await weatherResponse.json();
      
      setWeather({
        city: locationData.city,
        temp: Math.round(weatherData.current.temperature_2m),
        humidity: Math.round(weatherData.current.relative_humidity_2m),
        windSpeed: Math.round(weatherData.current.wind_speed_10m),
        pressure: Math.round(weatherData.current.pressure_msl),
        code: weatherData.current.weather_code
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Show fallback weather data to prevent app from breaking
      setWeather({
        city: 'Unavailable',
        temp: 20,
        humidity: 50,
        windSpeed: 5,
        pressure: 1013,
        code: 0 // Clear sky as fallback
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };  const getLocationData = async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve, 
            (error) => {
              // Handle specific geolocation errors
              switch(error.code) {
                case error.PERMISSION_DENIED:
                  console.log("User denied the request for geolocation");
                  break;
                case error.POSITION_UNAVAILABLE:
                  console.log("Location information is unavailable");
                  break;
                case error.TIMEOUT:
                  console.log("The request to get user location timed out");
                  break;
                case error.UNKNOWN_ERROR:
                  console.log("An unknown error occurred");
                  break;
              }
              reject(error);
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            }
          );
        });
        
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
        );
        const data = await response.json();
        
        return {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          city: data.city || data.locality || 'Your Location'
        };
      } catch (error) {
        console.log('Falling back to IP-based location', error);
        return null;
      }
    }
    console.log('Geolocation is not supported by this browser');
    return null;
  };
  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="bg-amber-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold">Weather</h2>
          <button className="text-gray-500 text-sm">View Details</button>
        </div>
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-10 bg-amber-200 rounded"></div>
          <div className="space-y-3">
            <div className="h-4 bg-amber-200 rounded"></div>
            <div className="h-4 bg-amber-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-100 rounded-xl p-4 shadow-sm relative overflow-hidden">      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-xl font-bold">Weather in {weather.city}</h2>
          {usingGPS && <span className="text-xs text-green-600">Using GPS Location</span>}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchWeather(true)}
            className={`text-gray-500 p-1 rounded-full hover:bg-white/50 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="text-gray-500 text-sm">View Details</button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-full p-2">
            <span className="text-2xl">{getWeatherEmoji(weather.code)}</span>
          </div>
        </div>
        <div className="text-5xl font-bold">{weather.temp}°C</div>
      </div>      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <div className="text-sm text-gray-600">Wind</div>
          <div className="font-medium">{weather.windSpeed} km/h</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Pressure</div>
          <div className="font-medium">{weather.pressure} hPa</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Humidity</div>
          <div className="font-medium">{weather.humidity}%</div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 opacity-10">
        <div className="text-[150px]">{getWeatherEmoji(weather.code)}</div>
      </div>
    </div>
  )
}
