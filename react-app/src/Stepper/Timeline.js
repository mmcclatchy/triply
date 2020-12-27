import React from 'react';
import { useSelector } from 'react-redux';

const Timeline = () => {
  // *** Redux ***
  const nodes = useSelector(state => state.stepper.nodes);
  console.log(nodes);

  return (
    <div style={{ border: '1px solid black', width: '25%' }}>
      <h1>Timeline</h1>
      {nodes &&
        Object.keys(nodes).map(node => {
          return (
            <div>
              <h3>{node}</h3>
              {nodes[node].map(e => {
                return <div>{e.name}</div>;
              })}
            </div>
          );
        })}
    </div>
  );
};

export default Timeline;
