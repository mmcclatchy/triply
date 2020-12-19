import React, { useState } from 'react';
import { algorithm } from './TestData';
import { useSelector, useDispatch } from 'react-redux';
import FakeStepper from './FakeStepper';
import FakeTimeline from './FakeTimeline';
import StartOfTripForm from '../TRIP/StartOfTripForm';

const TestEnvironment = () => {
  const suggestions = useSelector(state => state.testenv.suggestions);
  const nodes = useSelector(state => state.testenv.nodes);
  const [step, setStep] = useState('1');
  const [form, showForm] = useState(false);
  console.log(step);

  return (
    <>
      <h1> Test Environment</h1>
      <div
        style={{
          display: 'flex',
          width: '1000px',
          textAlign: 'center'
        }}>
        <FakeTimeline nodes={nodes} step={step} setStep={setStep} />
        {form ? (
          <StartOfTripForm showForm={showForm} />
        ) : (
          <FakeStepper suggestions={suggestions} />
        )}
      </div>
    </>
  );
};

export default TestEnvironment;
