import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSuggestion } from '../store/TestEnvironment/ReduxTest';
import { algorithm } from './TestData';

const FakeStepper = ({ suggestions, step }) => {
  const [data, setData] = useState({});
  const dispatch = useDispatch();
  console.log(suggestions, step);

  useEffect(() => {
    console.log(typeof step);
    dispatch(setSuggestion(algorithm[step - 1]), step);
  }, []);

  return (
    <div style={{ border: '1px solid black', width: '75%' }}>
      <h1>Fake Stepper</h1>
      <h2>Stop {step}</h2>
      <div>{JSON.stringify(suggestions[step])}</div>
    </div>
  );
};

export default FakeStepper;
