import React from 'react';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import HotelIcon from '@material-ui/icons/Hotel';
import LocalGasStationIcon from '@material-ui/icons/LocalGasStation';
import ExploreIcon from '@material-ui/icons/Explore';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import gasIcon from '../assets/GasStation.svg';
import hotelIcon from '../assets/hotel.svg';
import foodIcon from '../assets/food.svg';

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
  if (type === 'Destination') {
    return <ExploreIcon color='secondary' />;
  }
  if (type === 'Origin') {
    return <DriveEtaIcon color='primary' />;
  }
};

export const getTagline = (key, name) => {
  if (key === 'Restaurant') return `Meal at ${name}`;
  if (key === 'Hotel') return `Stay at ${name}`;
  if (key === 'GasStation') return `Refill at ${name}`;
  if (key === 'Origin') return `Departing from ${name}`;
  if (key === 'Destination') return `Arriving at ${name}`;
};

export const meal = time => {
  const idx = time.indexOf(':');
  const hour = time.slice(0, idx);
  if (time.includes('am') && parseInt(hour) >= 5) {
    return 'Breakfast';
  } else if (time.includes('pm') && parseInt(hour) < 6) {
    return 'Lunch';
  } else {
    return 'Dinner';
  }
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
