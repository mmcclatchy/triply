import React, { useEffect, useState } from 'react';
import { Button, Select, MenuItem } from '@material-ui/core';
import './CarForm.css';
import CarMakes from './CarMakes';

const CarForm = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [range, setRange] = useState([]);

  useEffect(() => {
    const year_range = (x, y) => {
      return Array(y - x + 1)
        .fill()
        .map((_, i) => x + i);
    };
    setRange(year_range(1984, 2021));
  }, []);

  const updateItem = cb => e => {
    return cb(e.target.value);
  };

  return (
    <div>
      <h1>New Car</h1>
      <form className='car__form'>
        <h3>Year</h3>
        <Select variant='outlined' value={year} onChange={updateItem(setYear)}>
          {range.map(year => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>

        <h3>Make</h3>
        <Select variant='outlined' value={make} onChange={updateItem(setMake)}>
          <CarMakes year={year} />
        </Select>
        <h3>Model</h3>
        <Select
          variant='outlined'
          value={model}
          onChange={updateItem(setModel)}>
          <MenuItem value='Honda'>Honda</MenuItem>
          <MenuItem value='BMW'>BMW</MenuItem>
        </Select>

        <Button variant='outlined' color='primary'>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default CarForm;
