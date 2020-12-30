import React from 'react';
import { useSelector } from 'react-redux';
import './Stepper.css';
import Node from './Node';
import hotelIcon from '../assets/hotel.svg';
import gasIcon from '../assets/GasStation.svg';
import foodIcon from '../assets/restaurant.svg';

//**************************************************************

const Suggestions = () => {
  // *** Redux ***
  const step = useSelector(state => state.stepper.step);
  const hotels = useSelector(state => state.stepper.suggestions[step].hotels);
  const restaurants = useSelector(
    state => state.stepper.suggestions[step].restaurants
  );
  const gasStations = useSelector(
    state => state.stepper.suggestions[step].gasStations
  );

  // *** Shorten Suggestions ***
  const threeHotels = hotels.slice(0, 3);
  const threeRestaurants = restaurants.slice(0, 3);
  const threeGasStations = gasStations.slice(0, 3);

  // *** JSX ***
  return (
    <div>
      <div className='Type__Container'>
        <img src={foodIcon} style={{ width: '50px' }} />
        <h1>Food</h1>
      </div>
      <div className='node__container'>
        {threeRestaurants &&
          threeRestaurants.map((food, index) => {
            return (
              <Node
                data={food}
                type='restaurants'
                key={index}
                index={index}
                className='node_restaurants'
              />
            );
          })}
      </div>

      <div className='Type__Container'>
        <img src={gasIcon} style={{ width: '50px' }} />
        <h1>Refill</h1>
      </div>
      <div className='node__container'>
        {threeGasStations &&
          threeGasStations.map((gas, index) => {
            return (
              <Node
                data={gas}
                type='gasStations'
                key={index}
                index={index}
                className='gas_station_id'
              />
            );
          })}
      </div>
      <div className='Type__Container'>
        <img src={hotelIcon} style={{ width: '50px' }} />
        <h1>Hotels</h1>
      </div>
      <div className='node__container'>
        {threeHotels &&
          threeHotels.map((hotel, index) => {
            return (
              <Node
                data={hotel}
                type='hotels'
                key={index}
                index={index}
                className='node_hotels'
              />
            );
          })}
      </div>
    </div>
  );
};

export default Suggestions;
