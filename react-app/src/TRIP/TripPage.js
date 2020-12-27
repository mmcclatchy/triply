import React, { useState } from 'react';
import Map from '../Map/Map';
import TripSummary from './TripSummary';
// import TripTimeline from '../Timeline/TripTimeline';
import TripTimeline from '../TestEnvironment/Timeline';
import StartOfTripForm from './StartOfTripForm';
import { Link } from 'react-router-dom';
import './TripPage.css';
import SuggestionStepper from '../Stepper/Stepper';

const TripPage = () => {
  const [toggle, setToggle] = useState(true);
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
          {toggle ? (
            <StartOfTripForm setToggle={setToggle} />
          ) : (
            <SuggestionStepper />
          )}
        </div>
      </div>
    </>
  );
};

export default TripPage;
