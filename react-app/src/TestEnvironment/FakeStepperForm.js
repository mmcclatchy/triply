import React from 'react';

const FakeStepperForm = ({ type, data }) => {
  return (
    <div>
      <h2>Suggestions For {data.time}</h2>
      {(JSON.stringify(data), type)}
      {data ? <h1>Hotel Suggestions</h1> : null}
    </div>
  );
};

export default FakeStepperForm;
