import React, { useState } from 'react';
import { getIcon, iconColors, meal } from './timelineUtility';
import { Typography, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  TimelineItem,
  TimelineOppositeContent,
  TimelineContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector
} from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: '6px 16px',
    marginBottom: '5px'
  },
  detail: {
    border: '1px solid red',
    position: 'absolute',
    width: '300px',
    marginLeft: '200px'
  }
}));

const Node = ({ data }) => {
  const classes = useStyles();
  const [view, setView] = useState(false);

  const toggleView = () => {
    if (view) {
      setView(false);
    } else {
      setView(true);
    }
  };

  return (
    <TimelineItem>
      <TimelineOppositeContent>
        <Typography variant='body2' color='textSecondary'>
          {data.time}
        </Typography>
      </TimelineOppositeContent>

      {data.type &&
        data.type.map((t, i) => {
          const type = Object.keys(t)[0];
          const color = iconColors[type];
          return (
            <TimelineSeparator>
              <TimelineDot color={color} onClick={toggleView}>
                {getIcon(type)}
              </TimelineDot>
              {i === data.type.length - 1 ? <TimelineConnector /> : null}
            </TimelineSeparator>
          );
        })}

      {view ? (
        <TimelineContent onClick={toggleView} className={classes.detail}>
          {data.type &&
            data.type.map((t, i) => {
              const key = Object.keys(t)[0];
              return (
                <Paper elevation={3} className={classes.paper}>
                  <Typography variant='h6' component='h1'>
                    {key === 'Restaurant'
                      ? `${meal(data.time)} at ${t[key]}`
                      : null}
                    {key === 'Hotel' ? `Staying at ${t[key]}` : null}
                    {key === 'Gas' ? `Refill at ${t[key]}` : null}
                    {key === 'Origin' ? `Departing from ${t[key]}` : null}
                    {key === 'Destination' ? `Arriving at ${t[key]}` : null}
                  </Typography>
                  <Typography>Address: 123 App Academy Road</Typography>
                  <Typography>Phone: (123)-123-1234</Typography>
                </Paper>
              );
            })}
        </TimelineContent>
      ) : null}
    </TimelineItem>
  );
};

export default Node;
