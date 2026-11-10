import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  RefreshCw 
} from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: string;
  iconType: 'sun' | 'cloud-sun' | 'cloud' | 'rain' | 'snow' | 'thunder';
}

export const TopBarWeatherTime: React.FC = () => {
  // Live dynamic clock in Orléans (America/Toronto)
  const [timeInfo, setTimeInfo] = useState(() => {
    const now = new Date();
    return {
      time: new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Toronto',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(now),
      day: new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Toronto',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(now),
    };
  });

  // Weather state with fallback for Orléans, ON
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 11,
    condition: 'Partly Cloudy',
    iconType: 'cloud-sun',
  });
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // Update clock every 10 seconds
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeInfo({
        time: new Intl.DateTimeFormat('en-CA', {
          timeZone: 'America/Toronto',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).format(now),
        day: new Intl.DateTimeFormat('en-CA', {
          timeZone: 'America/Toronto',
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }).format(now),
      });
    };

    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch real-time weather from Open-Meteo for Orléans, ON (Lat: 45.4667, Lon: -75.5208)
  useEffect(() => {
    let isMounted = true;

    const fetchWeather = async () => {
      setIsLoadingWeather(true);
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=45.4667&longitude=-75.5208&current_weather=true'
        );
        if (!res.ok) throw new Error('Weather fetch failed');
        const data = await res.json();
        
        if (data.current_weather && isMounted) {
          const temp = Math.round(data.current_weather.temperature);
          const code = data.current_weather.weathercode;
          
          let condition = 'Clear';
          let iconType: WeatherData['iconType'] = 'sun';

          if (code === 0) {
            condition = 'Sunny';
            iconType = 'sun';
          } else if (code === 1 || code === 2) {
            condition = 'Partly Cloudy';
            iconType = 'cloud-sun';
          } else if (code === 3) {
            condition = 'Overcast';
            iconType = 'cloud';
          } else if (code === 45 || code === 48) {
            condition = 'Foggy';
            iconType = 'cloud';
          } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
            condition = 'Showers';
            iconType = 'rain';
          } else if ([71, 73, 75, 77, 85, 86].includes(code)) {
            condition = 'Snow / Flurries';
            iconType = 'snow';
          } else if ([95, 96, 99].includes(code)) {
            condition = 'Thunderstorm';
            iconType = 'thunder';
          }

          setWeather({
            temperature: temp,
            condition,
            iconType,
          });
        }
      } catch (err) {
        // Keep realistic fallback for Orléans, ON
        console.debug('Weather fetch error or offline, using default Orléans weather info', err);
      } finally {
        if (isMounted) setIsLoadingWeather(false);
      }
    };

    fetchWeather();
    // Refresh weather every 15 minutes
    const weatherInterval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(weatherInterval);
    };
  }, []);

  const renderWeatherIcon = () => {
    switch (weather.iconType) {
      case 'sun':
        return <Sun className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'cloud-sun':
        return <CloudSun className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'cloud':
        return <Cloud className="w-4 h-4 text-neutral-500 shrink-0" />;
      case 'rain':
        return <CloudRain className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'snow':
        return <CloudSnow className="w-4 h-4 text-sky-400 shrink-0" />;
      case 'thunder':
        return <CloudLightning className="w-4 h-4 text-purple-500 shrink-0" />;
      default:
        return <CloudSun className="w-4 h-4 text-amber-500 shrink-0" />;
    }
  };

  return (
    <div 
      className="flex items-center gap-2 sm:gap-3 p-1.5 sm:px-3 sm:py-1.5 bg-neutral-50 border-2 border-black hover:border-yellow-400 rounded-none transition-colors select-none shrink-0"
      title="Live Local Time and Weather in Orléans, Ontario"
    >
      {/* Time Segment */}
      <div className="flex items-center gap-1.5 text-xs text-neutral-900">
        <Clock className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
        <span className="font-mono font-bold">{timeInfo.time}</span>
        <span className="hidden md:inline text-[11px] text-neutral-500">
          · {timeInfo.day}
        </span>
      </div>

      {/* Divider */}
      <div className="w-[2px] h-4 bg-black/40" />

      {/* Weather Segment */}
      <div className="flex items-center gap-1.5 text-xs text-neutral-900">
        {renderWeatherIcon()}
        <span className="font-bold">{weather.temperature}°C</span>
        <span className="hidden sm:inline text-neutral-600 text-[11px] font-medium">
          {weather.condition}
        </span>
        <span className="hidden lg:inline text-[10px] text-neutral-400 uppercase font-semibold">
          Orléans
        </span>
      </div>
    </div>
  );
};
