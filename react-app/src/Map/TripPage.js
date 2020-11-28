import React from 'react';
import Map from './Map';
import { NavLink } from 'react-router-dom';
import './TripPage.css';

const TripPage = () => {
  return (
    <div>
      <NavLink to='/'>
        <div className='trip_temp_logo' />
      </NavLink>
      <h1>Trip Form</h1>
      <Map />
    </div>
  );
};

export default TripPage;
