import React from 'react';
import { useSelector } from 'react-redux';

import Node from './Node';

//**************************************************************

const Suggestions = ({ data }) => {
  // *** Redux ***
  const step = useSelector(state => state.stepper.step);
  const hotels = useSelector(state => state.stepper.suggestions[step].hotels);
  const restaurants = useSelector(state => state.stepper.suggestions[step].restaurants);
  const gasStations = useSelector(state => state.stepper.suggestions[step].gasStations);

  
  // *** JSX ***
  return (
    <div>
      <h2>Suggestions For {data.time}</h2>

      <h3>Hotels</h3>
      {hotels &&
        hotels.map(hotel => {
          return <Node data={hotel} id='hotel_id' />;
        })}

      <h3>Food</h3>
      {restaurants &&
        restaurants.map(food => {
          return <Node data={food} id='restaurant_id' />;
        })}

      <h3>Refill</h3>
      {gasStations &&
        gasStations.map(gas => {
          return <Node data={gas} id='gas_station_id' />;
        })}
    </div>
  );
};

export default Suggestions;
