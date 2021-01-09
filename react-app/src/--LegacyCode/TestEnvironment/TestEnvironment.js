import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Stepper from './Stepper';
import Timeline from './Timeline';

const TestEnvironment = () => {
  const suggestions = useSelector(state => state.testenv.suggestions);
  const nodes = useSelector(state => state.testenv.nodes);
  const step = useSelector(state => state.testenv.step);

  const [form, showForm] = useState(true);

  const submitForm = () => {
    showForm(false);
  };

  return (
    <>
      <h1> Test Environment</h1>
      <div
        style={{
          display: 'flex',
          width: '1000px',
          textAlign: 'center'
        }}>
        <Timeline nodes={nodes} />
        {form ? (
          <button onClick={submitForm}>Submit Form</button>
        ) : (
          <Stepper suggestions={suggestions} step={step} />
        )}
      </div>
    </>
  );
};

export default TestEnvironment;
