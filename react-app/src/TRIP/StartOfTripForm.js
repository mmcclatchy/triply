import { Typography, Paper, Button } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import CardTravelIcon from '@material-ui/icons/CardTravel';
import LocalGasStationIcon from '@material-ui/icons/LocalGasStation';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import HotelIcon from '@material-ui/icons/Hotel';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import './TripPage.css';
import { useDispatch, useSelector} from 'react-redux';
import { useHistory } from 'react-router-dom';
import { putTrip } from '../store/actions/trips'
import { setDuration } from '../store/actions/setDuration';

const StartOfTripForm = props => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [car, setCar] = useState([])
  const [selectedCar, setSelectedCar] = useState([]);
  const [stopTime, setStopTime] = useState(5400);
  const [sleepTime, setSleepTime] = useState(18000);
  const [tolls, setTolls] = useState(false);
  const [options, setOptions] = useState([
    'Mexican',
    'Fast Food',
    'Pizza',
    'Asian',
    'American'
  ]);
  const [additionalOption, setAdditionalOption] = useState('');
  const [selectedFoods, setSelectedFoods] = useState([]);
  const userId = useSelector(state => state.authentication.userId);
  const handleCarChange = e => {setSelectedCar(e.target.value)};
  const handleStopChange = e => setStopTime(e.target.value);
  const handleSleepChange = e => setSleepTime(e.target.value);
  const handleCheck = e => {
    setTolls(e.target.checked);
  };
  const saveInfo = e => {
    const op = document.getElementById('options').childNodes;
    const selectedFood = [];
    op.forEach(el => {
      if (el.lastChild.checked) {
        selectedFood.push(el.lastChild.id);
      }
    });
    dispatch(putTrip(
      {
        db: {
          carId: car.id,
          dailyTimeLimit: sleepTime,
          stopTimeLimit: stopTime,
          avoidTolls: tolls,
        },
        preferences: {
          foodQuery: selectedFood,
        }
      })
    );
    history.push('/create-trip');
  };

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

  useEffect(() => {
    if (options.length === 5) {
      return;
    }
    const newBox = document.getElementById('options').lastChild.lastChild;
    // console.log(newBox);
    newBox.checked = true;
    // console.log('Hello');
  }, [options.length]);

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

  useEffect(() => {
  //  console.log("useeffect ran")
    if (!userId) {
      return null;
    }

    const getCars = async () => {
      const response = await fetch(`/api/users/${userId}/cars`);
      const data = await response.json();
      setCar(data.cars);
      // console.log(data.cars)
      // console.log(car)
    };
    getCars();
  },[])

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
            <label>Which car will you be driving?</label>
            <select value={selectedCar} onChange={handleCarChange}>
              {/* {car && */}
                { Object.keys(car).map(key => {
                  const current = car[`${key}`]
                  return (
                    <option key={current.id} value={current.id}>{current.year}{current.make}{current.model}</option>
                  )
              })},
            </select>
          </div>
          <br />
          <LocalGasStationIcon />
          <div>
            <label>How often are we stopping?</label>
            <select value={stopTime} onChange={handleStopChange}>
              <option value={5400}>Every Hour or Two</option>
              <option value={9000}>Every Two or Three Hours</option>
              <option value={10800}>Every Three or Four Hours</option>
              <option value={'Never'}>Only When I Will Run Out of Gas</option>
            </select>
          </div>
          <br />
          <HotelIcon />
          <div>
            <label>How often do you want to sleep?</label>
            <select value={sleepTime} onChange={handleSleepChange}>
              <option value={18000}>Every Four to Six Hours</option>
              <option value={28800}>Every Seven to Nine Hours</option>
              <option value={39600}>Every Ten to Twelve Hours</option>
              <option value={14400}>Every Thirteen to Fifteen Hours</option>
              <option value={'Never'}>What's a sleep?</option>
            </select>
          </div>
          <br />
          <MonetizationOnIcon />
          <div>
            <label>Avoid Tolls?</label>
            <input type={'checkbox'} checked={tolls} onClick={handleCheck} />
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
    </Paper>
  );
};

export default StartOfTripForm;
