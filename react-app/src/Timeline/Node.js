import React, { useState } from 'react';
import { getIcon, iconColors, getTagline } from './timelineUtility';
import { Typography, Paper, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  TimelineItem,
  TimelineOppositeContent,
  TimelineContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector
} from '@material-ui/lab';
import Node_Detail from './Node_Detail';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: '6px 16px',
    marginBottom: '5px'
  },
  detail: {
    position: 'absolute',
    width: '300px',
    marginLeft: '1000px',
    border: '1px solid red'
  },
  timestamp: {
    marginTop: '12px'
  }
}));

const Node = ({ data, origin, destination, head, tail }) => {
  const classes = useStyles();
  const end = { Origin: origin, Destination: destination };
  const [view, setView] = useState(false);

  const toggleView = () => {
    if (view) {
      setView(false);
    } else {
      setView(true);
    }
  };

  const clickHandler = e => {
    // console.log(e.target.parentElement.getAttribute('value'));
  };

  return (
    <>
      <TimelineItem>
        <TimelineOppositeContent className={classes.timestamp}>
          <Typography variant='body2' color='textSecondary'>
            {(data.time || data[0].time).slice(10)}
          </Typography>
        </TimelineOppositeContent>
        <>
          {data.length ? (
            data.map((node, i) => {
              const type = node.type;
              const color = iconColors[type];
              return (
                <TimelineSeparator>
                  <TimelineDot color={color} onClick={toggleView}>
                    {getIcon(type)}
                  </TimelineDot>
                  {i === data.length - 1 ? <TimelineConnector /> : null}
                </TimelineSeparator>
              );
            })
          ) : (
            <TimelineSeparator>
              <TimelineDot color={iconColors[data.type]} onClick={toggleView}>
                {getIcon(data.type)}
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
          )}
        </>
      </TimelineItem>

      <Node_Detail
        clickHandler={clickHandler}
        end={end}
        classes={classes}
        view={view}
        toggleView={toggleView}
        data={data}
      />
    </>
  );
};

export default Node;
