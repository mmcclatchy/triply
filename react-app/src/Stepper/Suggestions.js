import React from 'react';
import { useSelector } from 'react-redux';

import Node from './Node';

//**************************************************************

const Suggestions = ({ data }) => {
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
  const threeHotels = hotels.slice(0, 1);
  const threeRestaurants = restaurants.slice(0, 1);
  const threeGasStations = gasStations.slice(0, 1);

  // *** JSX ***
  return (
    <div>
      <h2>Suggestions For {data.time}</h2>

      <h3>Hotels</h3>
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

      <h3>Food</h3>
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

      <h3>Refill</h3>
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
  );
};

export default Suggestions;
