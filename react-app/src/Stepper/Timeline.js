import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getIcon, getTagline, mealTagline } from './timelineUtility';
import { DateTime } from 'luxon';
import { Paper, Switch, Slide } from '@material-ui/core';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import './Stepper.css';

const Timeline = () => {
  const nodes = useSelector(state => state.stepper.nodes);
  const origin = useSelector(state => state.directions.origin);
  const destination = useSelector(state => state.directions.destination);
  const start = useSelector(state => state.directions.startTime);
  const duration = useSelector(state => state.directions.duration);
  const suggestions = useSelector(state => state.stepper.suggestions);
  const startTime = DateTime.fromISO(start).toLocaleString(
    DateTime.DATETIME_MED
  );
  const [display, setDisplay] = useState('');
  const [checked, setChecked] = useState(false);

  const getStopTime = (node, suggestions) => {
    if (!suggestions[node]) return;

    const stopISO = suggestions[node].stopISO;
    return DateTime.fromISO(stopISO).toLocaleString(DateTime.DATETIME_SHORT);
  };

  const getEndTime = (start, duration) => {
    if (!duration) return;

    const durationSplit = duration.split(' ');
    if (durationSplit[3] === 'mins') durationSplit[3] = 'minutes';

    const durationObj = {
      [durationSplit[1]]: parseInt(durationSplit[0]) || 0,
      [durationSplit[3]]: parseInt(durationSplit[2]) || 0
    };
    return DateTime.fromISO(start)
      .plus(durationObj)
      .toLocaleString(DateTime.DATETIME_MED);
  };

  const handleChange = () => {
    setChecked(prev => !prev);
  };

  const converter = require('number-to-words');

  return (
    <>
      <Switch checked={checked} onChange={handleChange} />
      <Slide direction='top' in={checked} mountOnEnter unmountOnExit>
        <div className='Timeline__Container'>
          <Paper elevation={3} className='Start__Card'>
            {getIcon('Origin')}
            <h4>Departing</h4>
            <div>{startTime}</div>
            <div>{origin}</div>
          </Paper>

          {nodes &&
            Object.keys(nodes).map(node => {
              return (
                <div style={{ display: 'flex' }}>
                  {nodes[node].length ? (
                    <Paper elevation={3} className='Timeline__Divider'>
                      {converter.toWordsOrdinal(node).toUpperCase()} STOP
                      <a className='Card__Clock'>{getIcon('clock')}</a>
                      <a className='Card__Time'>
                        {getStopTime(node, suggestions)}
                      </a>
                    </Paper>
                  ) : null}

                  {nodes[node].map(e => {
                    return (
                      <Paper elevation={3} className='Timeline__Card'>
                        {getIcon(e.type)}

                        <div>
                          {e.type === 'restaurants' ? (
                            <h3>
                              {mealTagline(getStopTime(node, suggestions))}
                              {'  '}
                              {e.name}
                            </h3>
                          ) : (
                            <>
                              <h3>{getTagline(e.type)}</h3>
                              <h3>{e.name}</h3>
                            </>
                          )}
                          <div>{e.vicinity}</div>
                        </div>
                      </Paper>
                    );
                  })}
                </div>
              );
            })}
          <Paper elevation={3} className='Start__Card'>
            {getIcon('Destination')}
            <h4> Arriving</h4>
            <div>{getEndTime(start, duration)}</div>
            <div>{destination}</div>
          </Paper>
        </div>
      </Slide>
    </>
  );
};

export default Timeline;
