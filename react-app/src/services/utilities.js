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

// used to persist state by loading/storing store into local storage
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

//samesies
export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch {
    // ignore write errors
  }
};
