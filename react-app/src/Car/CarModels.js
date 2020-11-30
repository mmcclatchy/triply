import React, { useState, useEffect } from 'react';
import { getModels } from '../services/fueleconomyAPI';
import { MenuItem, Select } from '@material-ui/core';

const CarModels = ({ year, make, model, setModel, updateItem, resetForm }) => {
  const [models, setModels] = useState([]);
  console.log(models);

  useEffect(() => {
    getModels(year, make).then(data => setModels(data));
  }, [year, make]);

  return (
    <>
      <Select value={model} onChange={updateItem(setModel)} variant='outlined'>
        {models && models.length ? (
          models.map(model => {
            return (
              <MenuItem
                key={JSON.stringify(model)}
                value={model.text['#text']}>
                {model.text['#text']}
              </MenuItem>
            );
          })
        ) : (
          <MenuItem onClick={resetForm}>No Models Found</MenuItem>
        )}
      </Select>
    </>
  );
};

export default CarModels;
