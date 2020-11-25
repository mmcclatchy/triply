import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import './CarForm.css';
import CarMakes from './CarMakes';
import CarYears from './CarYears';
import CarModels from './CarModels';

const CarForm = ({ userId }) => {
  const [year, setYear] = useState();
  const [make, setMake] = useState();
  const [model, setModel] = useState();
  const [mpg, setMPG] = useState();
  const [apiId, setapiId] = useState();

  const submitHandler = e => {
    e.preventDefault();
    const new_car = {
      user_id: userId,
      api_id: apiId,
      year: year,
      make: make,
      model: model,
      mpg: mpg
    };
    console.log(new_car);
  };

  const calculateMPG = e => {
    e.preventDefault();
    console.log(year, make, model);
  };

  const updateYear = e => {
    setYear(e.target.value);
  };

  const updateMake = e => {
    setMake(e.target.value);
  };

  const updateModel = e => {
    setModel(e.target.value);
  };

  const updateItem = cb => e => {
    return cb(e.target.value);
  };

  return (
    <div>
      <h1>New Car</h1>
      <form className='car__form' onSubmit={submitHandler}>
        <div>
          <h3>Year</h3>
          <CarYears year={year} setYear={setYear} updateItem={updateItem} />

          <h3>Make</h3>

          <CarMakes
            year={year}
            make={make}
            setMake={setMake}
            updateItem={updateItem}
          />

          <h3>Model</h3>
          <CarModels
            year={year}
            make={make}
            model={model}
            setModel={setModel}
            updateItem={updateItem}
          />
          <Button variant='contained' onClick={calculateMPG}>
            Calculate my MPG
          </Button>
        </div>
        <div>
          <h3>MPG Estimate*</h3>
          <TextField type='text' variant='outlined' />
          <Button type='submit' variant='outlined' color='primary'>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CarForm;
