export function useTime() {
    const currentDate = Vue.ref("");

    const formatDate = () => {
        const now = new Date();

        // 한국 시간으로 변환 (UTC +9)
        const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);

        const yy = String(koreaTime.getFullYear()).slice(2);
        const mm = String(koreaTime.getMonth() + 1).padStart(2, '0');
        const dd = String(koreaTime.getDate()).padStart(2, '0');

        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const weekday = days[koreaTime.getDay()];
        
        return `${yy}.${mm}.${dd} (${weekday}) ${formatTime(now, true)}`;
    };

    const formatTime = (dt, isHour12 = false) => {
        const date = new Date(dt * 1000);
        return date.toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: isHour12,
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
