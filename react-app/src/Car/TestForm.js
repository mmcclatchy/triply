import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideForm } from '../store/actions/utilities';
import { getVehicleId, getMPG, getTankSize } from '../services/fueleconomyAPI';
import { registerCar } from '../services/car';
import { makeStyles } from '@material-ui/core/styles';
import './CarForm.css';
import CarMakes from './CarMakes';
import CarYears from './CarYears';
import CarModels from './CarModels';
import { postCar } from '../store/actions/cars';
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
  Paper,
  TextField
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(3)
  }
}));

function getSteps() {
  return [
    'Enter Vehicle Information',
    'Verify Miles Per Gallon',
    'Review and Register Vehicle'
  ];
}

const TestForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [mpg, setMPG] = useState('');
  const [apiId, setApiID] = useState('');
  const [tankSize, setTankSize] = useState(14);
  const [car, setCar] = useState({});
  const dispatch = useDispatch();
  const classes = useStyles();
  const userId = useSelector(state => state.authentication.userId);
  const steps = getSteps();

  const submitHandler = e => {
    e.preventDefault();
    const new_car = {
      userId: userId,
      apiId: apiId,
      year: year,
      make: make,
      model: model,
      mpg: parseInt(mpg),
      tankSize: tankSize
    };
    setCar(new_car);
  };
  
  useEffect(() => {
    if (Object.keys(car).length === 0) return
    dispatch(postCar(car, userId));
    dispatch(hideForm());
  }, [car]);

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <div className='stepper__one'>
            <div>
              Year
              <CarYears
                year={year}
                setYear={setYear}
                updateItem={updateItem}
              />
            </div>
            <div>
              Make
              <CarMakes
                year={year}
                make={make}
                setMake={setMake}
                updateItem={updateItem}
              />
            </div>
            <div>
              Model
              <CarModels
                resetForm={resetForm}
                year={year}
                make={make}
                model={model}
                setModel={setModel}
                updateItem={updateItem}
              />
            </div>
          </div>
        );
      case 1:
        return (
          <>
            <p>*Estimated MPG, Manually Edit to Adjust.</p>
            <TextField
              value={mpg}
              type='text'
              variant='outlined'
              onChange={updateMPG}>
              {mpg}
            </TextField>
          </>
        );
      case 2:
        return (
          <>
            <h2>Your Vehicle</h2>
            <h4>Year: {year}</h4>
            <h4>Model: {model}</h4>
            <h4>Make: {make}</h4>
            <h4>MPG: {mpg}</h4>
          </>
        );
      default:
        return 'Unknown Step';
    }
  };

  const calculateMPG = async () => {
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

  const getTank = async () => {
    const data = await getTankSize(make, model, year);
    console.log(data);
  };

  const resetForm = () => {
    setYear('');
    setMake('');
    setModel('');
  };

  const handleNext = () => {
    if (year && model && make) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
      calculateMPG();
    } else {
      alert('Please Fill out entire Form!');
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const updateItem = cb => e => {
    return cb(e.target.value);
  };

  const updateMPG = e => {
    setMPG(e.target.value);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation='vertical'>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography>{getStepContent(index)}</Typography>
              <div className={classes.actionsContainer}>
                <div>
                  {activeStep === 0 ? (
                    <Button className={classes.button} onClick={resetForm}>
                      Reset
                    </Button>
                  ) : (
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.button}>
                      Back
                    </Button>
                  )}
                  {activeStep === 2 ? (
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={submitHandler}>
                      Register Vehicle
                    </Button>
                  ) : (
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={handleNext}
                      className={classes.button}>
                      {activeStep === 0 ? 'Calculate MPG' : null}
                      {activeStep === 1 ? 'Continue' : null}
                    </Button>
                  )}
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
};

export default TestForm;
