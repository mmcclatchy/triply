import React from 'react';
import { useSelector } from 'react-redux';
import { getIcon, getTagline } from './timelineUtility';
import { DateTime } from 'luxon';
import { Paper } from '@material-ui/core';
import './Stepper.css';

const Timeline = () => {
  const nodes = useSelector(state => state.stepper.nodes);
  const origin = useSelector(state => state.directions.origin);
  const destination = useSelector(state => state.directions.destination);
  const start = useSelector(state => state.directions.startTime);
  const duration = useSelector(state => state.directions.duration);
  const startTime = DateTime.fromISO(start).toLocaleString(
    DateTime.DATETIME_SHORT
  );
  
  const getEndTime = (start, duration) => {
    const durationSplit = duration.split(' ')
    if (durationSplit[3] === 'mins') durationSplit[3] = 'minutes';
    
    const durationObj = {
      [durationSplit[1]]: parseInt(durationSplit[0]) || 0,
      [durationSplit[3]]: parseInt(durationSplit[2]) || 0
    }
    
    return DateTime.fromISO(start)
      .plus(durationObj)
      .toLocaleString(DateTime.DATETIME_SHORT);
  }

  const converter = require('number-to-words');

  return (
    <div
      style={{
        width: '100%',
        textAlignLast: 'center'
      }}>
      <h3>Trip Timeline</h3>
      <Paper elevation={3} className='Timeline__Card'>
        <h4>{getIcon('Origin')} Departing</h4>
        <div>{startTime}</div>
        <div>{origin}</div>
      </Paper>
      {nodes &&
        Object.keys(nodes).map(node => {
          return (
            <div>
              <Paper elevation={3} className='Timeline__Divider'>
                {converter.toWordsOrdinal(node).toUpperCase()} STOP
              </Paper>
              {nodes[node].map(e => {
                return (
                  <Paper elevation={3} className='Timeline__Card'>
                    {getIcon(e.type)}
                    <div>
                      <h3>{getTagline(e.type)}</h3>
                      <h3>{e.name}</h3>
                      <div>{e.vicinity}</div>
                    </div>
                  </Paper>
                );
              })}
            </div>
          );
        })}
      <Paper elevation={3} className='Timeline__Card'>
        <h4>{getIcon('Destination')} Arriving</h4>
        <div>{getEndTime(start, duration)}</div>
        <div>{destination}</div>
      </Paper>
    </div>
  );
};

export default Timeline;
