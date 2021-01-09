import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getIcon, getTagline, mealTagline } from './timelineUtility';
import { DateTime } from 'luxon';
import { Paper, Switch, Slide, FormControlLabel } from '@material-ui/core';
import './Stepper.css';
import { Timeline, TimelineEvent } from 'react-event-timeline';
import { useN01SwitchStyles } from '@mui-treasury/styles/switch/n01';

const Tester = () => {
  //#region *** Redux *** Click Tab to Toggle ***
  const nodes = useSelector(state => state.stepper.nodes);
  const origin = useSelector(state => state.directions.origin);
  const destination = useSelector(state => state.directions.destination);
  const start = useSelector(state => state.directions.startTime);
  const duration = useSelector(state => state.directions.duration);
  const suggestions = useSelector(state => state.stepper.suggestions);
  const startTime = DateTime.fromISO(start).toLocaleString(
    DateTime.DATETIME_MED
  );
  //#endregion

  const [checked, setChecked] = useState(true);
  const [showAll, setShowAll] = useState(true);
  const switchStyles = useN01SwitchStyles();

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

  const toggleInfo = () => {
    setShowAll(prev => !prev);
  };

  const converter = require('number-to-words');

  return (
    <>
      <div>
        <FormControlLabel
          control={
            <Switch
              classes={switchStyles}
              checked={checked}
              onChange={handleChange}
              color='primary'
            />
          }
          label='Timeline'
        />
        <FormControlLabel
          label='Details'
          control={
            <Switch
              classes={switchStyles}
              checked={showAll}
              onChange={toggleInfo}
              color='primary'
            />
          }
        />
      </div>

      <Slide direction='right' in={checked} mountOnEnter unmountOnExit>
        <Timeline className='Timeline__Wrapper'>
          <TimelineEvent
            title={origin}
            collapsible={!showAll}
            icon={getIcon('Origin')}
            contentStyle={{ backgroundColor: 'none' }}>
            <Paper elevation={3} className='Start__Card'>
              <h4>Departing</h4>
              <h4>{origin}</h4>
              <div>{startTime}</div>
            </Paper>
          </TimelineEvent>

          {nodes &&
            Object.keys(nodes).map(node => {
              const ref = nodes[node][0].type || null;
              return (
                <TimelineEvent
                  icon={getIcon(ref)}
                  collapsible={!showAll}
                  style={{ postion: 'absolute', overflow: 'scroll' }}
                  contentStyle={{
                    backgroundColor: 'none'
                  }}>
                  <div className='individual__stop'>
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
                </TimelineEvent>
              );
            })}
          <TimelineEvent
            title={destination}
            collapsible={!showAll}
            icon={getIcon('Destination')}
            contentStyle={{ backgroundColor: 'none' }}>
            <Paper elevation={3} className='Start__Card'>
              <h4> Arriving</h4>
              <h4>{destination}</h4>
              <div>{getEndTime(start, duration)}</div>
            </Paper>
          </TimelineEvent>
        </Timeline>
      </Slide>
    </>
  );
};

export default Tester;
