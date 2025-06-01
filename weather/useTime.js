export function useTime() {
    const currentDate = Vue.ref("");

    const formatDate = () => {
        const date = new Date();
        return date.toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
            year: "2-digit",
            month: "2-digit",
            day: "numeric",
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    };

    const formatTime = (dt) => {
        const date = new Date(dt * 1000);
        return date.toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    };

    const getTimePeriodKey = () => {
        const date = new Date();
        const hours = date.toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
            hour: "2-digit",
            hour12: false,
        });
        const h = parseInt(hours, 10);
        if (h >= 5 && h < 12) return "morning";
        if (h >= 12 && h < 17) return "afternoon";
        if (h >= 17 && h < 21) return "evening";
        return "night";
    };

    // 실시간 날짜 갱신
    setInterval(() => {
        currentDate.value = formatDate();
    }, 1000);

    return {
        currentDate,
        getTimePeriodKey,
        formatTime,
    };
}
