import React from 'react';
import { Select, MenuItem } from '@material-ui/core';

const CarYears = ({ year, setYear, updateItem }) => {
  const year_range = (x, y) => {
    return Array(y - x + 1)
      .fill()
      .map((_, i) => (x + i).toString());
  };

  const range = year_range(1984, 2021);

  return (
    <>
      <Select value={year} onChange={updateItem(setYear)} variant='outlined'>
        {range.map(y => (
          <MenuItem key={y} value={y}>
            {y}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default CarYears;
