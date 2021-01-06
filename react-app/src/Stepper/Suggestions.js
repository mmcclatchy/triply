import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Stepper.css';
import Node from './Node';
import hotelIcon from '../assets/hotel.svg';
import gasIcon from '../assets/GasStation.svg';
import foodIcon from '../assets/restaurant.svg';
import Button from '@material-ui/core/Button';
import { setDisplayedSuggestions } from '../store/actions/stepper';

//**************************************************************

const Suggestions = ({ type, typeName, label }) => {
  // *** Redux ***
  const currentSuggestions = useSelector(state => state.stepper.displayedSuggestions);
  const dispatch = useDispatch();
  
  
  // *** Local State ***
  const [nodeIndex, setNodeIndex] = useState(0);  
  

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
    const suggestions = type.slice(nodeIndex, nodeIndex + 3)
    dispatch(setDisplayedSuggestions(typeName, suggestions))
  }, [nodeIndex]);
  
  useEffect(() => {}, [currentSuggestions])
  

  
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
        {
          currentSuggestions?.[typeName]?.map((suggestion, i) => {
            return (
              <Node
                data={suggestion}
                type={typeName}
                key={i}
                index={i}
                className={`node_${typeName}`}
              />
            );
          })
        }
      </div>
      
    </div>
  );
};

export default Suggestions;
