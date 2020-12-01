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
          let tail = false;
          if (i === 0 || i === stops.length - 1) tail = true;
          return (
            <Node
              tail={tail}
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
