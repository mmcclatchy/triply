import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import './CarForm.css';
import CarMakes from './CarMakes';
import CarYears from './CarYears';
import CarModels from './CarModels';
import { registerCar } from '../services/car';
import { hideForm } from '../store/actions/utilities';
import { getVehicleId, getMPG } from '../services/fueleconomyAPI';
import TestForm from './TestForm';

const CarForm = ({ userId }) => {
  const [year, setYear] = useState();
  const [make, setMake] = useState();
  const [model, setModel] = useState();
  const [mpg, setMPG] = useState();
  const [apiId, setApiID] = useState();
  const dispatch = useDispatch();

  const submitHandler = async e => {
    e.preventDefault();
    const new_car = {
      userId: userId,
      apiId: apiId,
      year: year,
      make: make,
      model: model,
      mpg: mpg
    };
    await registerCar(new_car, userId);
  };

  const calculateMPG = async e => {
    e.preventDefault();

    const data = await getVehicleId(year, make, model);
    let id;

    if (data.length > 1) {
      id = data[0].value['#text'];
    } else {
      id = data.value['#text'];
    }
    const mpg_data = await getMPG(id);
    setMPG(mpg_data);
    setApiID(id);
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

  const updateMPG = e => {
    setMPG(e.target.value);
  };

  return (
    <div>
      <h1>New Car</h1>
      <TestForm
        year={year}
        setYear={setYear}
        make={make}
        setMake={setMake}
        model={model}
        setModel={setModel}
        updateItem={updateItem}
        mpg={mpg}
        updateMPG={updateMPG}
      />
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
          <p>
            * If this estimate seems inaccurate, click here to manually edit
            your MPG.
          </p>
          <TextField
            value={mpg}
            type='text'
            variant='outlined'
            onChange={updateMPG}>
            {mpg}
          </TextField>
          <Button type='submit' variant='outlined' color='primary'>
            Submit
          </Button>
          <Button onClick={() => dispatch(hideForm())}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default CarForm;
