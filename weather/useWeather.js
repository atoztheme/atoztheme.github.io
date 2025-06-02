export function useWeather() {
    const weather = Vue.ref(null);
    const error = Vue.ref("");

    const apiKey = "84c184d4d265556e18832eaf140f200d";

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
            case "01d":
                return "sunny";
            case "01n":
                return "clear_night";
            case "02d":
                return "partly_cloudy_day";
            case "02n":
                return "partly_cloudy_night";
            case "03d":
            case "03n":
            case "04d":
            case "04n":
                return "cloud";
            case "09d":
            case "09n":
                return "rainy_light";
            case "10d":
            case "10n":
                return "rainy";
            case "11d":
            case "11n":
                return "thunderstorm";
            case "13d":
            case "13n":
                return "weather_snowy";
            case "50d":
            case "50n":
                return "foggy";
            default:
                return "help";
        }
    };

    const coordsEqual = (a, b) => {
        if (!a || !b) return false;
        return Math.abs(a.latitude - b.latitude) < 0.0001 && Math.abs(a.longitude - b.longitude) < 0.0001;
    };

    const fetchWeather = async (coords) => {
        error.value = "";
        weather.value = null;
        try {
            const { latitude, longitude } = coords;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=kr&appid=${apiKey}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("날씨 정보를 불러올 수 없습니다.");
            const data = await res.json();
            weather.value = data;
        } catch (err) {
            error.value = err.message;
        }
    };

    const getCurrentLocation = () => {
        error.value = "";
        // const saved = localStorage.getItem("coords");
        // let cachedCoords = null;

        // try {
        //     cachedCoords = saved ? JSON.parse(saved) : null;
        //     if (cachedCoords) {
        //         fetchWeather(cachedCoords);
        //         // return;
        //     }
        // } catch {
        //     localStorage.removeItem("coords");
        // }

        if (!navigator.geolocation) {
            error.value = "위치 정보를 지원하지 않는 브라우저입니다.";
        } else {
            console.log("위치 정보를 가져오는 중...");
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const newCoords = {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                    };
                    // if (!coordsEqual(cachedCoords, newCoords)) {
                    //     localStorage.setItem("coords", JSON.stringify(newCoords));
                    // }
                    fetchWeather(newCoords);
                },
                () => {
                    error.value = "위치 정보를 가져올 수 없습니다.";
                    // if (cachedCoords) {
                    //     fetchWeather(cachedCoords);
                    // }
                }
            );
        }
    };

    return {
        weather,
        error,
        getWeatherIcon,
        getCurrentLocation,
    };
}
