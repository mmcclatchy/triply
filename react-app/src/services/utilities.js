export const greeting = () => {
  const time = new Date().toLocaleTimeString().toLowerCase();
  const idx = time.indexOf(':');
  const hour = time.slice(0, idx);
  if (time.includes('am') && parseInt(hour) >= 5) {
    return 'Good Morning';
  } else if (time.includes('pm') && parseInt(hour) < 6) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};
