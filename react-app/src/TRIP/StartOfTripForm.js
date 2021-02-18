import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Typography, Paper, Button } from '@material-ui/core';
import CardTravelIcon from '@material-ui/icons/CardTravel';
import LocalGasStationIcon from '@material-ui/icons/LocalGasStation';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import HotelIcon from '@material-ui/icons/Hotel';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

import './TripPage.css';
import { postTrip } from '../store/actions/trips';
import tripFormStyling from './tripFormStyling';

//************************************************************

const StartOfTripForm = ({ setToggle }) => {
  const classes = tripFormStyling();
  
  // *** Redux ***
  const dispatch = useDispatch();
  const userName = useSelector(state => state.authentication.userName);
  // const trip = useSelector(state => state.trips);
  const userId = useSelector(state => state.authentication.userId);
  const startLocation = useSelector(state => state.directions.origin);
  const endLocation = useSelector(state => state.directions.destination);
  const startTime = useSelector(state => state.directions.startTime);

  // *** Local State ***
  const [car, setCar] = useState([]);
  const [selectedCar, setSelectedCar] = useState(1);
  const [timeBetweenStops, setTimeBetweenStops] = useState(5400);
  const [endTimeForDay, setEndTimeForDay] = useState(null);
  const [dailyStartTime, setDailyStartTime] = useState('10:00:00');
  const [disabled, setDisabled] = useState(true);
  const [avoidTolls, setAvoidTolls] = useState(false);
  const [options, setOptions] = useState([
    'Mexican',
    'Fast Food',
    'Pizza',
    'Asian',
    'American'
  ]);
  const [additionalOption, setAdditionalOption] = useState('');
  const [selectedFoods, setSelectedFoods] = useState(['Food']);

  // *** Helper Functions ***
  const handleCarChange = e => setSelectedCar(e.target.value);
  const handleStopChange = e => setTimeBetweenStops(e.target.value);
  const handleSleepChange = e => {
    e.target.value === `I don't need a hotel` ? setDisabled(true) : setDisabled(false);
    setEndTimeForDay(e.target.value);
  };
  const handleDailyStartTimeChange = e => setDailyStartTime(e.target.value);
  const handleCheck = e => setAvoidTolls(e.target.checked);
  const handleAdditionalOptionChange = e =>
    setAdditionalOption(e.target.value);

  const handleAdditionalOptionAddition = e => {
    if (!additionalOption) {
      return;
    }
    let o = options;
    o.push(additionalOption);
    // console.log('adding');
    // console.log(o);
    setOptions(o);
    setAdditionalOption('');
  };

  // *** Add and Removes Foods from Selected Array ***
  const handleCheckOfFood = e => {
    if (selectedFoods.includes(e.target.value)) {
      setSelectedFoods(selectedFoods.filter(food => food !== e.target.value));
      return;
    }
    if (e.target.value) setSelectedFoods([...selectedFoods, e.target.value]);
  };

  // *** Use Effect Hooks ***
  // On Mount: Get User's Car Data
  useEffect(() => {
    if (!userId) {
      return null;
    }

    const getCars = async () => {
      const response = await fetch(`/api/users/${userId}/cars`);
      const data = await response.json();
      setCar(data.cars);
    };
    getCars();
  }, []);

  // Re-Render when a hotel time is chosen
  useEffect(() => {
    // console.log('disabled: ', disabled)
  }, [disabled]);

  // Re-Render Options and Add Option to Selected Foods
  useEffect(() => {
    if (options.length === 5) return;
    const newBox = document.getElementById('options').lastChild.lastChild;
    newBox.checked = true;
    setSelectedFoods([...selectedFoods, newBox.value]);
  }, [options.length]);

  // *** Post Trip Info to the Backend ***
  const saveInfo = e => {
    dispatch(
      postTrip(
        {
          db: {
            userId,
            startLocation,
            endLocation,
            startISO: startTime,
            carId: selectedCar,
            endTimeForDay,
            timeBetweenStops,
            avoidTolls,
            dailyStartTime: endTimeForDay ? dailyStartTime : null,
            milesToRefuel: 350 //! Placeholder until new API works
          },
          preferences: {
            foodQuery: selectedFoods
          }
        },
        userId
      )
    );
    setToggle(false);
  };

  // *** JSX ***

  return (
    <Paper 
      // variant='outlined' 
      elevation={0} 
      className={classes.formContainer}
    >
      <div className='StartOfTripForm'>
        <div className='trip_customize_container'>
          <div className="start_trip_header">
            <CardTravelIcon color='primary' fontSize='large' />
            <Typography variant='h5' component='h1' style={{ width: 350 }}>
              Customize Your Trip
            </Typography>
          </div>

          <br />
          <div className={classes.inputContainer}>
            <DirectionsCarIcon fontSize='large' color='primary' />
            <FormControl className={classes.formControl}>
              {/* <InputLabel>Which car will you be driving?</InputLabel> */}
              <FormHelperText>Which car will you be driving?</FormHelperText>
              <NativeSelect 
                // defaultValue={1}
                value={selectedCar} 
                onChange={handleCarChange}
                inputProps={{ name: 'Car' }}
              >
                {car &&
                  Object.keys(car).map(key => {
                    const current = car[`${key}`];
                    return (
                      <option key={current.id} value={current.id}>
                        {current.year}
                        {current.make}
                        {current.model}
                      </option>
                    );
                  })}
                ,
              </NativeSelect>
            </FormControl>
          </div>
          <br />
          <div className={classes.inputContainer}>
            <LocalGasStationIcon fontSize='large' color='primary' />
            <FormControl className={classes.formControl}>
              <InputLabel>How often are we stopping?</InputLabel>
              <NativeSelect value={timeBetweenStops} onChange={handleStopChange}>
                <option value={5400}>Every Hour or Two</option>
                <option value={9000}>Every Two or Three Hours</option>
                <option value={10800}>Every Three or Four Hours</option>
                <option value={20000}>Only When I Will Run Out of Gas</option>
              </NativeSelect>
            </FormControl>
          </div>
          <br />
          <div className={classes.inputContainer} >
            <HotelIcon fontSize='large' color='primary' />
            <div className={classes.hotelTimes}>
              <FormControl className={classes.formControl}>
                <FormHelperText>What time do you want to stop for a hotel?</FormHelperText>
                <NativeSelect value={endTimeForDay} onChange={handleSleepChange}>
                  <option value={null} selected>
                    I don't need a hotel
                  </option>
                  <option value={'00:00:00'}>12 AM</option>
                  <option value={'00:01:00'}>1 AM</option>
                  <option value={'00:02:00'}>2 AM</option>
                  <option value={'00:03:00'}>3 AM</option>
                  <option value={'00:04:00'}>4 AM</option>
                  <option value={'00:05:00'}>5 AM</option>
                  <option value={'00:06:00'}>6 AM</option>
                  <option value={'00:07:00'}>7 AM</option>
                  <option value={'00:08:00'}>8 AM</option>
                  <option value={'00:09:00'}>9 AM</option>
                  <option value={'00:10:00'}>10 AM</option>
                  <option value={'00:11:00'}>11 AM</option>
                  <option value={'00:12:00'}>12 PM</option>
                  <option value={'00:13:00'}>1 PM</option>
                  <option value={'00:14:00'}>2 PM</option>
                  <option value={'00:15:00'}>3 PM</option>
                  <option value={'00:16:00'}>4 PM</option>
                  <option value={'00:17:00'}>5 PM</option>
                  <option value={'00:18:00'}>6 PM</option>
                  <option value={'00:19:00'}>7 PM</option>
                  <option value={'00:20:00'}>8 PM</option>
                  <option value={'00:21:00'}>9 PM</option>
                  <option value={'00:22:00'}>10 PM</option>
                  <option value={'00:23:00'}>11 PM</option>
                </NativeSelect>
              </FormControl>
            
              <FormHelperText className={classes.backOnRoad}>
                What time will you get back on the road?
              </FormHelperText>
              <NativeSelect
                className={classes.backOnRoadSelect}
                value={dailyStartTime}
                onChange={handleDailyStartTimeChange}
                disabled={disabled}>
                <option value={'00:00:00'}>12 AM</option>
                <option value={'00:01:00'}>1 AM</option>
                <option value={'00:02:00'}>2 AM</option>
                <option value={'00:03:00'}>3 AM</option>
                <option value={'00:04:00'}>4 AM</option>
                <option value={'00:05:00'}>5 AM</option>
                <option value={'00:06:00'}>6 AM</option>
                <option value={'00:07:00'}>7 AM</option>
                <option value={'00:08:00'}>8 AM</option>
                <option value={'00:09:00'}>9 AM</option>
                <option value={'00:10:00'}>10 AM</option>
                <option value={'00:11:00'}>11 AM</option>
                <option value={'00:12:00'}>12 PM</option>
                <option value={'00:13:00'}>1 PM</option>
                <option value={'00:14:00'}>2 PM</option>
                <option value={'00:15:00'}>3 PM</option>
                <option value={'00:16:00'}>4 PM</option>
                <option value={'00:17:00'}>5 PM</option>
                <option value={'00:18:00'}>6 PM</option>
                <option value={'00:19:00'}>7 PM</option>
                <option value={'00:20:00'}>8 PM</option>
                <option value={'00:21:00'}>9 PM</option>
                <option value={'00:22:00'}>10 PM</option>
                <option value={'00:23:00'}>11 PM</option>
              </NativeSelect>
            </div>
          </div>
          <br />

          <div className={classes.inputContainer}>
            <MonetizationOnIcon fontSize='large' color='primary' />
            <FormControl className={classes.avoidTolls}>
              <label>Avoid Tolls?</label>
              <Checkbox
                checked={avoidTolls}
                onChange={handleCheck}
                // label='Start'
                inputProps={{ "aria-label": 'avoid tolls checkbox' }}
              />
            </FormControl>
          </div>
          <br />

          <div className={classes.inputContainer}>
            <FastfoodIcon fontSize='large' color='primary' />
            <FormControl className={classes.formControl}>
              <FormHelperText>Select Food Preferences</FormHelperText>
              <div id='options' className={classes.foodCheckGroup}>
                {options.map((el, i) => (
                  <div className={classes.foodCheckbox} >
                    <label key={i * 2}>{el}</label>{' '}
                    <Checkbox
                      key={i * 2 + 1}
                      value={el}
                      onChange={handleCheckOfFood}
                      id={el}
                    />
                  </div>
                ))}
              </div>
              <div className={classes.additionalOption} >
                <TextField
                  label='Additional Preferences'
                  onChange={handleAdditionalOptionChange}
                  value={additionalOption}
                  className={classes.optionField}
                />
                  <Button
                    variant='outlined'
                    color='secondary'
                    onClick={handleAdditionalOptionAddition}
                  >
                    Add
                  </Button>
                </div>
            </FormControl>
          </div>
          <br />

          <div className={classes.generateTripButton} >
            <Button 
              color='primary' 
              variant='contained' 
              onClick={saveInfo}
            >
              Generate Trip
            </Button>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default StartOfTripForm;
