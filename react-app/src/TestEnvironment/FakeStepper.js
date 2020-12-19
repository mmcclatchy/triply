import React, { useState, useEffect } from 'react';

const FakeStepper = ({ suggestions, step, setStep }) => {
  useEffect(() => {
    console.log(step);
  }, [step]);

  return (
    <div style={{ border: '1px solid black', width: '75%' }}>
      <h1>Fake Stepper</h1>
      <h2>Stop</h2>
    </div>
  );
};

export default FakeStepper;
