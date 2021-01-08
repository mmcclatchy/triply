import React from 'react';
import Timeline from '@material-ui/lab/Timeline';
import { makeStyles } from '@material-ui/core/styles';
import { trip, car, stops } from './dummy_data';
import Node from './Node';

const useStyles = makeStyles(theme => ({
  time: {
    width: '180px',
    height: 'auto',
    marginTop: '30px'
  }
}));

const TripTimeline = () => {
  const classes = useStyles();

  return (
    <Timeline align='left' className={classes.time}>
      {stops &&
        stops.map((node, i) => {
          return (
            <Node
              head={i === 0}
              tail={i === stops.length - 1}
              data={node}
              origin={trip.start_location}
              destination={trip.end_location}
            />
          );
        })}
    </Timeline>
  );
};

export default TripTimeline;
