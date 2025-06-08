export function useWeather() {
  const { ref, computed } = Vue;
  const weather = ref(null);
  const forecastByDate = ref({});
  const error = ref('');
  const tempDiff = ref('');
  const tempDiffStr = ref('');
  const apiKey = '84c184d4d265556e18832eaf140f200d';

  // 날씨 아이콘
  // 아이콘 코드	설명 (주간/야간)	예시
  // 01d / 01n	맑음 (clear sky)	☀️ / 🌙
  // 02d / 02n	약간의 구름 (few clouds)	🌤️ / 🌥️
  // 03d / 03n	흩어진 구름 (scattered clouds)	☁️
  // 04d / 04n	구름 많음 (broken clouds)	☁️☁️
  // 09d / 09n	소나기 (shower rain)	🌧️
  // 10d / 10n	비 (rain)	🌦️
  // 11d / 11n	천둥번개 (thunderstorm)	⛈️
  // 13d / 13n	눈 (snow)	🌨️
  // 50d / 50n	안개 (mist)	🌫️
  const getWeatherIcon = (icon) => {
    switch (icon) {
      case '01d':
        return 'sunny';
      case '01n':
        return 'clear_night';
      case '02d':
        return 'partly_cloudy_day';
      case '02n':
        return 'partly_cloudy_night';
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return 'cloud';
      case '09d':
      case '09n':
        return 'rainy_light';
      case '10d':
      case '10n':
        return 'rainy';
      case '11d':
      case '11n':
        return 'thunderstorm';
      case '13d':
      case '13n':
        return 'weather_snowy';
      case '50d':
      case '50n':
        return 'foggy';
      default:
        return 'help';
    }
  };

  const fetchWeather = async (coords) => {
    let todayTemp;
    let yesterdayTemp;
    error.value = '';
    weather.value = null;
    try {
      const { latitude, longitude } = coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=kr&appid=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('날씨 정보를 불러올 수 없습니다.');
      const data = await res.json();
      weather.value = data;
      todayTemp = data.main.temp;

      const todayStr = new Date().toISOString().split('T')[0]; // 예: "2025-06-08"

      // localStorage에서 어제 온도와 날짜 불러오기
      const storedData = JSON.parse(localStorage.getItem('yesterdayWeather') || '{}');
      if (storedData) {
        const savedDate = storedData.date;
        const savedTemp = storedData.temp;
        const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        if (savedDate === yesterdayStr) {
          yesterdayTemp = parseFloat(savedTemp);
          tempDiff.value = (todayTemp - yesterdayTemp).toFixed(2);
          tempDiffStr.value = Math.abs(tempDiff.value);
        }
      }

      // 오늘 온도를 오늘 날짜와 함께 저장
      localStorage.setItem('yesterdayWeather', JSON.stringify({ date: todayStr, temp: todayTemp }));
    } catch (err) {
      error.value = err.message;
    }
  };

  const fetchForecast = async (coords) => {
    error.value = '';
    forecastByDate.value = {};
    try {
      const { latitude, longitude } = coords;
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&lang=kr&appid=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('날씨 리스트 정보를 불러올 수 없습니다.');
      const data = await res.json();
      const list = data.list;
      const grouped = {};

      list.forEach((item) => {
        const dt = new Date(item.dt_txt);
        const yy = String(dt.getFullYear()).slice(2);
        const mm = String(dt.getMonth() + 1).padStart(2, '0');
        const dd = String(dt.getDate()).padStart(2, '0');
        const time = String(dt.getHours()).padStart(2, '0') + '시';
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const weekday = days[dt.getDay()];
        const date = `${mm}.${dd}(${weekday})`;

        console.log(time);
        const entry = {
          time,
          temp: item.main.temp.toFixed(1),
          weather: item.weather[0].main,
          icon: item.weather[0].icon
        };

        if (!grouped[date]) {
          grouped[date] = [];
        }

        grouped[date].push(entry);
      });

      forecastByDate.value = grouped;
      console.log(forecastByDate.value);
    } catch (err) {
      error.value = err.message;
    }
  };

  const getCurrentLocation = () => {
    error.value = '';

    if (!navigator.geolocation) {
      error.value = '위치 정보를 지원하지 않는 브라우저입니다.';
    } else {
      console.log('위치 정보를 가져오는 중...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newCoords = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          };
          fetchWeather(newCoords);
          fetchForecast(newCoords);
        },
        () => {
          error.value = '위치 정보를 가져올 수 없습니다.';
        }
      );
    }
  };

  const diffSign = computed(() => {
    if (tempDiff.value > 0) return 'up';
    if (tempDiff.value < 0) return 'down';
    return '';
  });

  return {
    weather,
    forecastByDate,
    diffSign,
    tempDiffStr,
    error,
    getWeatherIcon,
    getCurrentLocation
  };
}
