import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Paper, Typography, Button } from '@material-ui/core';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import './TripPage.css';

const TripSummary = () => {
  const [details, setDetails] = useState(false);
  const userName = useSelector(state => state.authentication.userName);

  const userId = useSelector(state => state.authentication.userId);

  const distance = useSelector(state => state.directionsRedux.distance);
  const duration = useSelector(state => state.directionsRedux.duration);
  const origin = useSelector(state => state.directionsRedux.origin);
  const destination = useSelector(state => state.directionsRedux.destination);
  const startTime = useSelector(state => state.directionsRedux.startTime);

  useEffect(() => {
    const new_trip = {
      user_id: userId,
      start_time: startTime,
      start_location: origin,
      end_location: destination
    };
    console.log(new_trip);
  });

  const showDetails = open => {
    setDetails(open);
  };

  return (
    <>
      <Paper variant='outlined' elevation={8}>
        <div className='trip_summary_container'>
          {userName ?
          <Typography variant='h4' component='h1'>
            {userName ? `${userName}'s Trip` : `Triply Roadtrip`}
          </Typography>
            : null}

          {details ? (
            <>
              <Button color='primary' onClick={() => showDetails(false)}>
                <DriveEtaIcon />
                (Toggle Details)
              </Button>

              <div className='trip_summary_details'>
                <table className='trip_summary_table'>
                  <tbody>
                    <tr>
                      <td>
                        <b>Origin</b>
                      </td>
                      <td>{origin}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Destination</b>
                      </td>
                      <td> {destination}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Departure Date</b>
                      </td>
                      <td> {startTime}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Trip Duration</b>
                      </td>
                      <td> {duration}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Total Distance</b>
                      </td>
                      <td> {distance}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <Button color='primary' onClick={() => showDetails(true)}>
              <DriveEtaIcon />
              (Toggle Details)
            </Button>
          )}
        </div>
      </Paper>
    </>
  );
};

export default TripSummary;
