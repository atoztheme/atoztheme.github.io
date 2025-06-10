export function useTime() {
  const { ref } = Vue;
  const currentDate = ref('');

  const pad = (n) => String(n).padStart(2, '0');
  const formatDate = () => {
    let now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = days[now.getDay()];
    const hh = pad(now.getHours());
    const minute = pad(now.getMinutes());
    const ss = pad(now.getSeconds());
    return {
      date: `${yy}.${mm}.${dd} (${weekday})`,
      time: `${hh}.${minute}`
    };
  };

  const formatTime = (dt) => {
    let date = new Date(dt * 1000);
    date = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    const hh = String(date.getUTCHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${hh}.${mm}.${ss}`;
  };

  const getTimePeriodKey = () => {
    const date = new Date();
    const hours = date.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      hour: '2-digit',
      hour12: false
    });
    const h = parseInt(hours, 10);
    if (h >= 5 && h < 12) return 'morning';
    if (h >= 12 && h < 17) return 'afternoon';
    if (h >= 17 && h < 21) return 'evening';
    return 'night';
  };

  // 실시간 날짜 갱신
  setInterval(() => {
    currentDate.value = formatDate();
  }, 1000);

  return {
    currentDate,
    getTimePeriodKey,
    formatTime
  };
}
