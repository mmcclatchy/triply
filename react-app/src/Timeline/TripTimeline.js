import React from 'react';
import Timeline from '@material-ui/lab/Timeline';
import { makeStyles } from '@material-ui/core/styles';
import Node from './Node';

const useStyles = makeStyles(theme => ({
  time: {
    border: '1px solid black',
    width: '180px'
  }
}));

const TripTimeline = () => {
  const classes = useStyles();

  return (
    <Timeline align='left' className={classes.time}>
      <Node data={{ time: '7:30 am', type: [{ Origin: 'NYC, NY' }] }} />
      <Node
        data={{
          time: '9:30 am',
          type: [{ Restaurant: 'McDonalds' }, { Gas: 'Shell' }]
        }}
      />
      <Node data={{ time: '2:00 pm', type: [{ Restaurant: 'Sushi-O' }] }} />
      <Node
        data={{
          time: '7:00 pm',
          type: [{ Restaurant: 'Chipotle' }, { Gas: 'Exxon' }]
        }}
      />
      <Node
        data={{
          time: '9:00 pm',
          type: [
            { Destination: 'Philadelphia, PA' },
            { Hotel: 'Four Seasons' }
          ]
        }}
      />
    </Timeline>
  );
};

export default TripTimeline;
