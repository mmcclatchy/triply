import React, { useState, useEffect } from 'react';
import { getMakes } from '../services/fueleconomyAPI';
import { MenuItem, Select } from '@material-ui/core';

const CarMakes = ({ year }) => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    getMakes(year).then(setCars);
  }, []);

  return (
    <>
      <MenuItem>Test</MenuItem>
      {cars &&
        cars.map(car => (
          <MenuItem key={car} value={car.value['#text']}>
            {car.value['#text']}
          </MenuItem>
        ))}
    </>
  );
};

export default CarMakes;
