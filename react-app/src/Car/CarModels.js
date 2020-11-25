import React, { useState, useEffect } from 'react';
import { getModels } from '../services/fueleconomyAPI';
import { MenuItem, Select } from '@material-ui/core';

const CarModels = ({ year, make, model, setModel, updateItem }) => {
  const [models, setModels] = useState();

  console.log(models);

  useEffect(() => {
    getModels(year, make).then(setModels);
  }, [year, make]);

  return (
    <>
      <Select value={model} onChange={updateItem(setModel)} variant='outlined'>
        {models &&
          models.map(model => {
            return (
              <MenuItem
                key={JSON.stringify(model)}
                value={model.text['#text']}>
                {model.text['#text']}
              </MenuItem>
            );
          })}
      </Select>
    </>
  );
};

export default CarModels;
