import React from 'react';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import HotelIcon from '@material-ui/icons/Hotel';
import LocalGasStationIcon from '@material-ui/icons/LocalGasStation';
import ExploreIcon from '@material-ui/icons/Explore';
import DriveEtaIcon from '@material-ui/icons/DriveEta';

export const iconColors = {
  Restaurant: 'primary',
  Hotel: 'inherit',
  Gas: 'secondary',
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
  if (type === 'Gas') {
    return <LocalGasStationIcon />;
  }
  if (type === 'Destination') {
    return <ExploreIcon />;
  }
  if (type === 'Origin') {
    return <DriveEtaIcon />;
  }
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
