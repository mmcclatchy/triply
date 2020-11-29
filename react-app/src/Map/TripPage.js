import React from 'react';
import Map from './Map';
import TripSummary from './TripSummary';
import { NavLink } from 'react-router-dom';
import './TripPage.css';

const TripPage = () => {
  return (
    <div>
      <NavLink to='/'>
        <div className='trip_temp_logo' />
      </NavLink>
      <h1>Trip Form</h1>
      <TripSummary />
      <Map />
    </div>
  );
};

export default TripPage;
