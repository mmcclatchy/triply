import React, { useState } from 'react';
import Map from '../Map/Map';
import TripSummary from './TripSummary';
import StartOfTripForm from './StartOfTripForm';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './TripPage.css';
import Timeline from '../Stepper/Timeline';
import SuggestionStepper from '../Stepper/Stepper';
import TripComplete from './TripComplete';
import {
  setOriginAction,
  setDestinationAction,
  setStartTimeAction,
  setDistanceAction,
  setDurationAction,
  clearDirections
} from '../store/actions/directions';
import { clearTrips } from '../store/actions/trips';
import { clearStepper } from '../store/actions/stepper';
import Test from '../Stepper/Test';

const TripPage = () => {
  const [toggle, setToggle] = useState(true);
  const nodes = useSelector(state => state.stepper.nodes);
  const tripComplete = useSelector(state => state.stepper.tripComplete);
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setOriginAction(''));
    dispatch(setDestinationAction(''));
    dispatch(setStartTimeAction(''));
    dispatch(setDistanceAction(''));
    dispatch(setDurationAction(''));
    // dispatch(setName(""));
    // dispatch(setId(""));
    dispatch(clearTrips());
    dispatch(clearDirections());
    dispatch(clearStepper());
  };

  return (
    <>
      <div className='trip__container'>
        <div className='trip__container--initial'>
          <Link onClick={handleClick} to='/'>
            <div className='trip__logo' />
          </Link>
          <Test />
        </div>

        <div className='trip__map'>
          <Map />
        </div>

        <div className='trip__container--inner'>
          {toggle ? (
            <>
              <TripSummary view={false} />
              <StartOfTripForm setToggle={setToggle} />
            </>
          ) : tripComplete ? (
            <TripComplete />
          ) : (
            <SuggestionStepper />
          )}
        </div>
      </div>
    </>
  );
};

export default TripPage;
