// Homepage Navbar User Time Affect Greeting
export const greeting = () => {
  const time = new Date().getHours();
  if (time < 12) return 'Good Morning';
  else if (time >= 12 && time <= 17) return 'Good Afternoon';
  else if (time >= 17 && time <= 24) return 'Good Evening';
};

// Timeline Meal Custom Label
export const mealTime = time => {
  if (time < 12) return 'Breakfast at';
  else if (time >= 12 && time <= 17) return 'Lunch at';
  else if (time >= 17 && time <= 24) return 'Dinner at';
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
export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch {
    // ignore write errors
  }
};
