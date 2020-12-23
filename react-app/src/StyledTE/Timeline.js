import React from 'react';
import { mealTime } from '../services/utilities';
import { useSelector } from 'react-redux';

const FakeTimeline = ({ nodes }) => {
  const time = useSelector(state => state.testenv.suggestions);

  const getNodeTime = node => {
    const data = time[node].time;
    const nodeTime = new Date(data).getHours();
    return nodeTime;
  };

  return (
    <div style={{ border: '1px solid black', width: '25%' }}>
      <h1>Timeline</h1>
      {nodes &&
        Object.keys(nodes).map(node => {
          return (
            <div>
              <h3>{node}</h3>
              {nodes[node].map(e => {
                if (e.type === 'Restaurant') {
                  return (
                    <div>
                      {mealTime(getNodeTime(node))} {e.name}
                    </div>
                  );
                }
                return <div>{e.name}</div>;
              })}
            </div>
          );
        })}
    </div>
  );
};

export default FakeTimeline;
