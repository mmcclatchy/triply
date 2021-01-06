import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Stepper.css';
import { updateStep, clearDisplayedSuggestion } from '../store/actions/stepper';
import Suggestions from './Suggestions';
import { postStop } from '../store/actions/stops';
import { Paper, Button } from '@material-ui/core';
const converter = require('number-to-words');

//**********************************************************

const Stepper = () => {
  // *** Redux ***
  const step = useSelector(state => state.stepper.step);
  const suggestions = useSelector(state => state.stepper.suggestions);
  const data = useSelector(state => state.stepper.nodes);
  const tripId = useSelector(state => state.trips.currentTripId);
  const foodQuery = useSelector(state => state.directions.foodQuery);
  const dispatch = useDispatch();

  
  // *** Local State ***
  const [back, disableBack] = useState(false);

  
  // *** Use Effect Hooks ***
  useEffect(() => {
    if (step === 1) disableBack(true);
    if (step > 1) disableBack(false);
  }, [step]);

  
  // *** Actions ***
  const nextHandler = () => {
    const stop = {
      tripId,
      step,
      foodQuery,
      skipId:
        suggestions[step]?.restaurants[0]?.place_id ||
        suggestions[step]?.gasStations[0]?.place_id,
      tripStopNum: step,
      restaurant: data[step]?.restaurants || null,
      gasStation: data[step]?.gasStations || null,
      hotel: data[step]?.hotels || null,
      coordinates: suggestions[step].centerOfSearch,
      starMin: null, // TODO: Fix this when Hotels are added
      starMax: null,
      time: null
    };
    // console.log('STOP: ', stop);
    dispatch(postStop(stop, tripId));
    dispatch(updateStep(step + 1));
    dispatch(clearDisplayedSuggestion())
  };

  const prevHandler = () => {
    dispatch(updateStep(step - 1));
  };

  const submitTrip = () => {
    // TODO: Submit completed trip
  };


  // *** JSX ***
  return (
    <div className='Stepper__Container'>
      {suggestions[step] ? (
        <>
          <Paper elevation={3} className='Stop__Header'>
            <h1>BOOK {converter.toWordsOrdinal(step).toUpperCase()} STOP</h1>
          </Paper>

          <Suggestions 
            type={suggestions?.[step]?.restaurants} 
            typeName={'restaurants'} 
            label='Restaurants' />
          <Suggestions 
            type={suggestions?.[step]?.gasStations} 
            typeName={'gasStations'}
            label='Gas Stations' />
          <Suggestions 
            type={suggestions?.[step]?.hotels} 
            typeName={'hotels'}
            label='Hotels' />

          <Button variant='outlined' disabled={back} onClick={prevHandler}>
            Prev Stop
          </Button>
          <Button variant='outlined' onClick={nextHandler}>
            Next Stop
          </Button>
        </>
      ) : (
        <>
          {/* <h2>Trip Planned!</h2>
          <button disabled={back} onClick={prevHandler}>
            Back
          </button>
          <button onClick={submitTrip}>Complete</button> */}
          <h1>Calculating Your Next Stop...</h1>
          <div className='sk-folding-cube'>
            <div className='sk-cube1 sk-cube'></div>
            <div className='sk-cube2 sk-cube'></div>
            <div className='sk-cube4 sk-cube'></div>
            <div className='sk-cube3 sk-cube'></div>
          </div>
        </>
      )}
    </div>
  );
};

export default Stepper;
