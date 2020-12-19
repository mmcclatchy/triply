import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSuggestion, updateStep } from '../store/TestEnvironment/ReduxTest';
import { algorithm } from './TestData';
import FakeStepperForm from './FakeStepperForm';

const FakeStepper = ({ suggestions, step }) => {
  const dispatch = useDispatch();
  const [back, disableBack] = useState(false);

  const nextHandler = () => {
    dispatch(updateStep(step + 1));
  };

  const prevHandler = () => {
    dispatch(updateStep(step - 1));
  };

  useEffect(() => {
    if (step === 1) disableBack(true);
    if (step > 1) disableBack(false);
    dispatch(setSuggestion(algorithm[step - 1]));
  }, [step]);

  return (
    <div style={{ border: '1px solid black', width: '75%' }}>
      <h1>Fake Stepper</h1>

      {suggestions[step] ? (
        <>
          <h2>Stop {step}</h2>

          {suggestions[step].suggestions.Hotel ? (
            <FakeStepperForm
              type='Hotel'
              data={suggestions[step].suggestions.Hotel}
            />
          ) : null}

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
          <button>Complete</button>
        </>
      )}
    </div>
  );
};

export default FakeStepper;
