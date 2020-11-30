import React from 'react';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import HotelIcon from '@material-ui/icons/Hotel';
import LocalGasStationIcon from '@material-ui/icons/LocalGasStation';
import ExploreIcon from '@material-ui/icons/Explore';
import DriveEtaIcon from '@material-ui/icons/DriveEta';

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
  if (type === 'Restaurant') {
    return <FastfoodIcon />;
  }
  if (type === 'Hotel') {
    return <HotelIcon />;
  }
  if (type === 'GasStation') {
    return <LocalGasStationIcon />;
  }
  if (type === 'Destination') {
    return <ExploreIcon />;
  }
  if (type === 'Origin') {
    return <DriveEtaIcon />;
  }
};

export const getTagline = (key, name) => {
  if (key === 'Restaurant') return `Meal at ${name}`;
  if (key === 'Hotel') return `Staying at ${name}`;
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
