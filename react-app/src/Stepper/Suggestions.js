import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './Stepper.css';
import Node from './Node';
import hotelIcon from '../assets/hotel.svg';
import gasIcon from '../assets/GasStation.svg';
import foodIcon from '../assets/restaurant.svg';
import Button from '@material-ui/core/Button';

//**************************************************************

const Suggestions = ({ type, typeName, label }) => {
  // *** Redux ***
  // const step = useSelector(state => state.stepper.step);
  // const hotels = useSelector(state => state.stepper.suggestions[step].hotels);
  // const restaurants = useSelector(
  //   state => state.stepper.suggestions[step].restaurants
  // );
  // const gasStations = useSelector(
  //   state => state.stepper.suggestions[step].gasStations
  // );
  
  
  // *** Local State ***
  const [nodeIndex, setNodeIndex] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  
  

  // *** Helper Functions ***
  const handlePrevClick = (index, cb) => {
    if (index <= 3) cb(0);
    cb(index - 3);
  }
  
  const handleNextClick = (index, cb) => {
    cb(index + 3)
  }
  
  
  // *** Use Effects ***
  useEffect(() => {
    setSuggestions(type.slice(nodeIndex, nodeIndex + 3))
  }, [nodeIndex])
  

  
  // *** JSX ***
  return (
    <div>
      <div className='Type__Container'>
        <div className="node__prev-wrapper">
          {
            nodeIndex === 0
              ? <Button 
                  disabled 
                  disableElevation 
                  variant='outlined' 
                  // style={{ color: '#3f51b5' }}
                  className='node__suggestion-buttons'
                >
                  Previous
                </Button>
              : <Button 
                  disableElevation 
                  variant='outlined' 
                  // style={{ color: '#3f51b5' }}
                  className='node__suggestion-buttons'
                  onClick={() => handlePrevClick(nodeIndex, setNodeIndex)}
                >
                  Previous
                </Button>
          }
        </div>
        
        <div className="node__icon-label-wrapper">
          {typeName === 'restaurants' && <img src={foodIcon} style={{ width: '30px' }} />}
          {typeName === 'gasStations' && <img src={gasIcon} style={{ width: '30px' }} />}
          {typeName === 'hotels' && <img src={hotelIcon} style={{ width: '30px' }} />}
          <div className='node__label'>{label}</div>
        </div>
        
        <div className="node_next-wrapper">
          {
            nodeIndex >= type?.length - 4
              ? <Button 
                  disabled 
                  disableElevation 
                  variant='outlined' 
                  // style={{ color: '#3f51b5' }}
                  className='node__suggestion-buttons'
                >
                  Next
                </Button>
              : <Button 
                  disableElevation 
                  variant='outlined' 
                  // style={{ color: '#3f51b5' }}
                  className='node__suggestion-buttons'
                  onClick={() => handleNextClick(nodeIndex, setNodeIndex)}
                >
                  Next
                </Button>
          }
        </div>
      </div>
      
      <div className='node__container'>
        {suggestions &&
          suggestions.map((suggestion, i) => {
            return (
              <Node
                data={suggestion}
                type={typeName}
                key={i}
                index={i}
                className={`node_${typeName}`}
              />
            );
          })}
      </div>






      {/* <div className='Type__Container'>
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
      </div> */}
    </div>
  );
};

export default Suggestions;
