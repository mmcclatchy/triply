import React, { useState, useEffect } from 'react';
import { getMakes } from '../services/fueleconomyAPI';
import { MenuItem, Select } from '@material-ui/core';

const CarMakes = ({ year, make, setMake, updateItem }) => {
  const [cars, setCars] = useState();

  useEffect(() => {
    getMakes(year).then(setCars);
  }, [year]);

  return (
    <>
      <Select value={make} onChange={updateItem(setMake)} variant='outlined'>
        {cars &&
          cars.map(car => {
            return (
              <MenuItem key={JSON.stringify(car)} value={car.text['#text']}>
                {car.text['#text']}
              </MenuItem>
            );
          })}
      </Select>
    </>
  );
};

export default CarMakes;
