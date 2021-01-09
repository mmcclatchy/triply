import React from 'react';
import ExploreIcon from '@material-ui/icons/Explore';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import clockIcon from '../assets/clock.svg';
import gasIcon from '../assets/GasStation.svg';
import hotelIcon from '../assets/hotel.svg';
import foodIcon from '../assets/food.svg';
import breakfast from '../assets/pancakes.svg';
import dinner from '../assets/wine-bottle.svg';

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

export const iconColors = {
  Restaurant: 'primary',
  Hotel: 'inherit',
  GasStation: 'secondary',
  Destination: 'inherit',
  Origin: 'primary'
};

export const getIcon = type => {
  if (type === 'restaurants') {
    return <img src={foodIcon} style={{ width: '20px' }} />;
  }
  if (type === 'hotels') {
    return <img src={hotelIcon} style={{ width: '20px' }} />;
  }
  if (type === 'gasStations') {
    return <img src={gasIcon} style={{ width: '20px' }} />;
  }
  if (type === 'clock') {
    return <img src={clockIcon} style={{ width: '20px' }} />;
  }
  if (type === 'Destination') {
    return <ExploreIcon color='secondary' />;
  }
  if (type === 'Origin') {
    return <DriveEtaIcon color='primary' />;
  }
};

export const getTagline = key => {
  if (key === 'restaurants') return `Meal`;
  if (key === 'hotels') return `Sleep`;
  if (key === 'gasStations') return `Refill`;
};

// *** QOL Function for Meal Time on Timeline Nodes ***
export const mealTagline = time => {
  const date = new Date(time);
  const hrs = date.getHours();
  let greeting;
  if (hrs < 12) greeting = 'Breakfast at';
  else if (hrs >= 12 && hrs <= 17) greeting = 'Lunch at';
  else if (hrs >= 17 && hrs <= 24) greeting = 'Dinner at';
  return greeting;
};

// *** QOL Function for Meal Icon ***
export const mealIcon = time => {
  const date = new Date(time);
  const hrs = date.getHours();
  if (hrs < 12) return <img src={breakfast} style={{ width: '32px' }} />;
  else if (hrs >= 12 && hrs <= 17)
    return <img src={foodIcon} style={{ width: '32px ' }} />;
  else if (hrs >= 17 && hrs <= 24)
    return <img src={dinner} style={{ width: '32px ' }} />;
};

export const stopTimes = array => {
  return array.map(stop => {
    if (stop.length) {
      return ms_min(new Date(stop[0].time));
    }
    return ms_min(new Date(stop.time));
  });
};

export const ms_min = time => {
  return Math.floor(Date.parse(time) / 60000);
};

export const populateNode = (current, array) => {
  return array.some(t => {
    const diff = t - current;
    if (diff < 60 && diff >= 0) {
      return true;
    }
    return false;
  });
};

export const getStarIcon = rating => {
  const rounded = Math.round(parseFloat(rating) * 2) / 2 || 0;
  return (
    <img
      src={require(`../assets/stars/${rounded}.png`)}
      style={{ width: '90%' }}
    />
  );
};

export const getPriceDisplay = price => {
  const parsed = parseInt(price);
  let output = '';
  for (let i = 1; i <= parsed; i++) {
    output += '$';
  }
  return output;
};
