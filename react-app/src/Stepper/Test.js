import React, { useEffect, useState } from 'react';
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

  const [formatNodes, setFormatNodes] = useState([]);
  const [checked, setChecked] = useState(true);
  const [showAll, setShowAll] = useState(true);
  const switchStyles = useN01SwitchStyles();

  //#region  *** UE Formatting Node Data *** Click Tab to Toggle ***
  useEffect(() => {
    (async () => {
      const data = Object.keys(nodes)
        .map(stop => {
          return [
            ...nodes[stop].map(n => {
              n['stop'] = parseInt(stop);
              return n;
            })
          ];
        })
        .flat();
      setFormatNodes(data);
    })();
  }, [nodes]);
  //#endregion

  const getStopTime = (node, suggestions) => {
    if (suggestions && suggestions[node]) {
      const stopISO = suggestions[node].stopISO;
      return DateTime.fromISO(stopISO).toLocaleString(DateTime.DATETIME_SHORT);
    }
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
        <label style={{ marginRight: '6px' }}>View</label>
        <FormControlLabel
          control={
            <Switch
              classes={switchStyles}
              checked={checked}
              onChange={handleChange}
            />
          }
        />
        <label style={{ marginRight: '6px' }}>Details</label>
        <FormControlLabel
          control={
            <Switch
              classes={switchStyles}
              checked={showAll}
              onChange={toggleInfo}
            />
          }
        />
      </div>

      <Slide direction='right' in={checked} mountOnEnter unmountOnExit>
        <Timeline className='Timeline__Wrapper' lineColor='black'>
          <TimelineEvent
            title={origin}
            collapsible={!showAll}
            bubbleStyle={{ border: '2px solid black' }}
            icon={getIcon('Origin')}
            contentStyle={{ backgroundColor: 'none' }}>
            <Paper elevation={3} className='Start__Card'>
              <h4>Departing</h4>
              <h4>{origin}</h4>
              <div>{startTime}</div>
            </Paper>
          </TimelineEvent>

          {nodes &&
            formatNodes.map((node, idx) => {
              let time = getStopTime(node.stop, suggestions);
              return (
                <TimelineEvent
                  icon={getIcon(node.type)}
                  collapsible={!showAll}
                  bubbleStyle={{ border: '2px solid black' }}
                  contentStyle={{
                    backgroundColor: 'none'
                  }}>
                  <Paper elevation={3} className='Timeline__Divider'>
                    {getIcon('clock')}
                    {converter.toWordsOrdinal(idx + 1).toUpperCase()} STOP
                    {getStopTime(time)}
                  </Paper>
                  <Paper elevation={3} className='Start__Card'>
                    {node.type === 'restaurants' ? (
                      <h3>
                        {mealTagline(getStopTime(time))}
                        {'  '}
                        {node.name}
                      </h3>
                    ) : (
                      <>
                        <h3>{getTagline(node.type)}</h3>
                        <h3>{node.name}</h3>
                      </>
                    )}
                    <div>{node.vicinity}</div>
                  </Paper>
                </TimelineEvent>
              );
            })}

          <TimelineEvent
            title={destination}
            collapsible={!showAll}
            bubbleStyle={{ border: '2px solid black' }}
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
