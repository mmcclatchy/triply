import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateStep } from '../store/actions/stepper';
import Suggestions from './Suggestions';

//*************************************************************

const Stepper = () => {
  // *** Redux ***
  const step = useSelector(state => state.stepper.step);
  const suggestions = useSelector(state => state.stepper.suggestions);
  const data = useSelector(state => state.stepper.nodes);
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
    dispatch(updateStep(step + 1));
  };

  const prevHandler = () => {
    dispatch(updateStep(step - 1));
  };

  const submitTrip = () => {
    console.log(data);
  };
  

  // *** JSX ***
  return (
    <div style={{ border: '1px solid black', width: '75%' }}>
      <h1>Stepper</h1>

      {suggestions[step] ? (
        <>
          <h2>Stop {step}</h2>
          <h3>Selected</h3>
          {data[step] &&
            data[step].map(e => {
              return (
                <div>
                  {e.type}: {e.name}
                </div>
              );
            })}

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
