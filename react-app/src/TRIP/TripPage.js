import React, { useEffect } from 'react';
import Map from '../Map/Map';
import TripSummary from './TripSummary';
import TripTimeline from '../Timeline/TripTimeline';
import StartOfTripForm from './StartOfTripForm';
import { Link } from 'react-router-dom';
import './TripPage.css';

const TripPage = () => {
  return (
    <>
      <div className='trip__container'>
        <div className='trip__container--initial'>
          <Link to='/'>
            <div className='trip__logo' />
          </Link>
          <TripTimeline />
        </div>

        <div className='trip__map'>
          <Map />
        </div>

        <div className='trip__container--inner'>
          <TripSummary />
          <StartOfTripForm />
        </div>
      </div>
    </>
  );
};

export default TripPage;
