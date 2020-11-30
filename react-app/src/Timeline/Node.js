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

const useStyles = makeStyles(theme => ({
  paper: {
    padding: '6px 16px',
    marginBottom: '5px'
  },
  detail: {
    position: 'absolute',
    width: '300px',
    marginLeft: '200px'
  }
}));

const Node = ({ tail, data, origin, destination }) => {
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
    console.log(e.target.parentElement.getAttribute('value'));
  };

  return (
    <TimelineItem>
      <TimelineOppositeContent>
        <Typography variant='body2' color='textSecondary'>
          {tail
            ? data.time || data[0].time
            : (data.time || data[0].time).slice(10)}
        </Typography>
      </TimelineOppositeContent>

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

      {view ? (
        <>
          <TimelineContent onClick={toggleView} className={classes.detail}>
            {data.length ? (
              data.map(node => {
                const key = node.type;
                const id = node.id;
                const info = node.details;

                return (
                  <Paper elevation={3} className={classes.paper}>
                    {end[key] ? null : (
                      <Button
                        onClick={clickHandler}
                        value={id}
                        variant='outlined'
                        color='secondary'>
                        Edit/Delete
                      </Button>
                    )}
                    <Typography variant='h6' component='h1'>
                      {info
                        ? getTagline(key, info.name)
                        : getTagline(key, end[key])}
                    </Typography>

                    {info ? (
                      <div>
                        <div>
                          <Typography>{info.street_address}</Typography>
                          <Typography>
                            {info.city}, {info.state} {info.zip_code}
                          </Typography>
                          <Typography>{info.phone_num}</Typography>
                        </div>
                        <div>
                          <img width='80px' height='80px' src={info.img_url} />
                        </div>
                      </div>
                    ) : null}
                  </Paper>
                );
              })
            ) : (
              <Paper elevation={3} className={classes.paper}>
                <Typography variant='h6' component='h1'>
                  {data.details
                    ? getTagline(data.type, data.details.name)
                    : getTagline(data.type, end[data.type])}
                </Typography>

                {data.details ? (
                  <div>
                    <div>
                      <Typography>{data.details.street_address}</Typography>
                      <Typography>
                        {data.details.city}, {data.details.state}{' '}
                        {data.details.zip_code}
                      </Typography>
                      <Typography>{data.details.phone_num}</Typography>
                    </div>
                    <div>
                      <img
                        width='80px'
                        height='80px'
                        src={data.details.img_url}
                      />
                    </div>
                  </div>
                ) : null}
                {end[data.type] ? null : (
                  <Button
                    onClick={clickHandler}
                    variant='outlined'
                    color='secondary'>
                    Edit/Delete
                  </Button>
                )}
              </Paper>
            )}
          </TimelineContent>
        </>
      ) : null}
    </TimelineItem>
  );
};

export default Node;
