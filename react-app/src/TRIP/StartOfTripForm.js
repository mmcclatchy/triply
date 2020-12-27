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
// import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import './TripPage.css';
import { postTrip } from '../store/actions/trips';
// import SuggestionStepper from '../Suggestions/SuggestionStepper';
import SuggestionStepper from '../Stepper/Stepper';
// import { setDuration } from '../store/actions/setDuration';

//************************************************************

const StartOfTripForm = ({ setToggle }) => {
  // *** Redux ***
  const dispatch = useDispatch();
  const userName = useSelector(state => state.authentication.userName);
  // const trip = useSelector(state => state.trips);
  const userId = useSelector(state => state.authentication.userId);
  const startLocation = useSelector(state => state.directions.origin);
  const endLocation = useSelector(state => state.directions.destination);
  const startTime = useSelector(state => state.directions.startTime);
  // console.log(trip);

  // *** Local State ***
  const [car, setCar] = useState([]);
  const [selectedCar, setSelectedCar] = useState([]);
  const [timeBetweenStops, setTimeBetweenStops] = useState(5400);
  const [endTimeForDay, setEndTimeForDay] = useState(18000);
  const [avoidTolls, setAvoidTolls] = useState(false);
  const [options, setOptions] = useState([
    'Mexican',
    'Fast Food',
    'Pizza',
    'Asian',
    'American'
  ]);
  const [additionalOption, setAdditionalOption] = useState('');
  const [selectedFoods, setSelectedFoods] = useState([]);

  // *** Helper Functions ***
  const handleCarChange = e => setSelectedCar(e.target.value);
  const handleStopChange = e => setTimeBetweenStops(e.target.value);
  const handleSleepChange = e => setEndTimeForDay(e.target.value);
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

  const handleCheckOfFood = e => {
    if (e.target.value) {
      let s = selectedFoods;
      s.push(e.target.id);
      setSelectedFoods(s);
    } else {
      let s = selectedFoods;
      let i = s.findIndex(e.target.id);
      if (i === -1) {
        return;
      }
      s.slice(i, 1);
      setSelectedFoods(s);
      // console.log(s);
    }
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

  // Re-render when options change
  useEffect(() => {
    if (options.length === 5) {
      return;
    }
    const newBox = document.getElementById('options').lastChild.lastChild;
    // console.log(newBox);
    newBox.checked = true;
  }, [options.length]);

  // *** Post Trip Info to the Backend ***
  const saveInfo = e => {
    const op = document.getElementById('options').childNodes;
    const selectedFood = [];
    op.forEach(el => {
      if (el.lastChild.checked) {
        selectedFood.push(el.lastChild.id);
      }
    });
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
            milesToRefuel: 350 //! Placeholder until new API works
          },
          preferences: {
            foodQuery: selectedFood
          }
        },
        userId
      )
    );
    setToggle(false);
  };

  // *** JSX ***

  return (
    <Paper variant='outlined' elevation={8}>
      <div className='StartOfTripForm'>
        <div className='trip_customize_container'>
          <CardTravelIcon />
          <Typography variant='h5' component='h1'>
            Customize Your Trip
          </Typography>

          <br />

          <DirectionsCarIcon />
          <div>
            {userName ? (
              <>
                <label>Which car will you be driving?</label>
                <select value={selectedCar} onChange={handleCarChange}>
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
                </select>
              </>
            ) : (
              <Link to='/'>
                <label>Sign In To Choose a Vehicle</label>
              </Link>
            )}
          </div>
          <br />
          <LocalGasStationIcon />
          <div>
            <label>How often are we stopping?</label>
            <select value={timeBetweenStops} onChange={handleStopChange}>
              <option value={5400}>Every Hour or Two</option>
              <option value={9000}>Every Two or Three Hours</option>
              <option value={10800}>Every Three or Four Hours</option>
              <option value={20000}>Only When I Will Run Out of Gas</option>
            </select>
          </div>
          <br />
          <HotelIcon />
          <div>
            <label>How often do you want to sleep?</label>
            <select value={endTimeForDay} onChange={handleSleepChange}>
              <option value={18000}>Every Four to Six Hours</option>
              <option value={28800}>Every Seven to Nine Hours</option>
              <option value={39600}>Every Ten to Twelve Hours</option>
              <option value={14400}>Every Thirteen to Fifteen Hours</option>
              <option value={1000000}>What's a sleep?</option>
            </select>
          </div>
          <br />
          <MonetizationOnIcon />
          <div>
            <label>Avoid Tolls?</label>
            <input
              type={'checkbox'}
              checked={avoidTolls}
              onClick={handleCheck}
            />
          </div>
          <br />
          <FastfoodIcon />
          <div>
            <label>Select Food Preferences</label>
            <div id='options'>
              {options.map((el, i) => (
                <div>
                  <label key={i * 2}>{el}</label>{' '}
                  <input
                    key={i * 2 + 1}
                    type='checkbox'
                    onChange={handleCheckOfFood}
                    className={el}
                    id={el}
                  />
                </div>
              ))}
            </div>
            <br />
            <MonetizationOnIcon />
            <div>
              <label>Avoid Tolls?</label>
              <input
                type={'checkbox'}
                checked={avoidTolls}
                onClick={handleCheck}
              />
            </div>
            <br />
            <FastfoodIcon />
            <div>
              <label>Select Food Preferences</label>
              <div id='options'>
                {options.map((el, i) => (
                  <div>
                    <label key={i * 2}>{el}</label>{' '}
                    <input
                      key={i * 2 + 1}
                      type='checkbox'
                      onChange={handleCheckOfFood}
                      className={el}
                      id={el}
                    />
                  </div>
                ))}
              </div>
              <input
                onChange={handleAdditionalOptionChange}
                value={additionalOption}
              />
              <Button
                variant='outlined'
                onClick={handleAdditionalOptionAddition}>
                Add Option
              </Button>
            </div>
            <br />

            <Button color='primary' variant='outlined' onClick={saveInfo}>
              Generate Trip
            </Button>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default StartOfTripForm;
