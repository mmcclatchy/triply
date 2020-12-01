import React from 'react';
import { getTagline } from './timelineUtility';
import { Typography, Paper, Button } from '@material-ui/core';
import './Node_Detail.css';

const Node_Detail = ({
  clickHandler,
  end,
  data,
  view,
  toggleView,
  classes
}) => {
  return (
    <div className='node__detail--container'>
      {view ? (
        <div onClick={toggleView} className='node__detail'>
          {data.length ? (
            data.map(node => {
              const key = node.type;
              const id = node.id;
              const info = node.details;

              return (
                <>
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
                      <div className='node__inner__details'>
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
                </>
              );
            })
          ) : (
            <Paper elevation={3} className={classes.paper}>
              {end[data.type] ? null : (
                <Button
                  onClick={clickHandler}
                  variant='outlined'
                  color='secondary'>
                  Edit/Delete
                </Button>
              )}
              <Typography variant='h6' component='h1'>
                {data.details
                  ? getTagline(data.type, data.details.name)
                  : getTagline(data.type, end[data.type])}
              </Typography>

              {data.details ? (
                <div className='node__inner__details'>
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
            </Paper>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Node_Detail;
