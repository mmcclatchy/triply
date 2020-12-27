import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateStep } from '../store/actions/stepper';
import Suggestions from './Suggestions';
import { postStop } from '../store/actions/stops';

//*************************************************************

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
  const [restaurant, setRestaurant] = useState(null);
  const [gasStation, setGasStation] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [skipId, setSkipId] = useState(null);

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
    console.log('STOP: ', stop);
    dispatch(postStop(stop, tripId));
    dispatch(updateStep(step + 1));
  };

  const prevHandler = () => {
    dispatch(updateStep(step - 1));
  };

  const submitTrip = () => {
    // TODO: Submit completed trip
  };

  // *** JSX ***
  return (
    <div style={{ border: '1px solid black', width: '75%' }}>
      <h1>Stepper</h1>

      {suggestions[step] ? (
        <>
          <h2>Stop {step}</h2>
          <h3>Selected</h3>
          {/* {[data[step]] &&
            Object.values(data[stepZ]).map(stopType => {
              return (
                <div>
                  {stopType.type}: {stopType.name}
                </div>
              );
            })} */}

          <Suggestions data={suggestions[step]} />

          <button disabled={back} onClick={prevHandler}>
            Back
          </button>
          <button onClick={nextHandler}>Next</button>
        </>
      ) : (
        <>
          <h2>Trip Planned!</h2>
          <button disabled={back} onClick={prevHandler}>
            Back
          </button>
          <button onClick={submitTrip}>Complete</button>
        </>
      )}
    </div>
  );
};

export default Stepper;
