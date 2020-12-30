import React, { useState } from 'react';
import Map from '../Map/Map';
import TripSummary from './TripSummary';
import StartOfTripForm from './StartOfTripForm';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './TripPage.css';
import Timeline from '../Stepper/Timeline';
import SuggestionStepper from '../Stepper/Stepper';
import TripComplete from './TripComplete';

const TripPage = () => {
  const [toggle, setToggle] = useState(true);
  const nodes = useSelector(state => state.stepper.nodes);
  const tripComplete = useSelector(state => state.stepper.tripComplete);
  
  return (
    <>
      <div className='trip__container'>
        <div className='trip__container--initial'>
          <Link to='/'>
            <div className='trip__logo' />
          </Link>
          <Timeline nodes={nodes} />
        </div>

        <div className='trip__map'>
          <Map />
        </div>

        <div className='trip__container--inner'>
          <TripSummary />
          {toggle 
            ? <StartOfTripForm setToggle={setToggle} />
            : tripComplete
                ? <TripComplete />
                : <SuggestionStepper />
          }
        </div>
      </div>
    </>
  );
};

export default TripPage;
