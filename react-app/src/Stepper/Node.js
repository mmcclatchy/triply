import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Stepper.css';
import { fetchImg, setNode, unsetNode } from '../store/actions/stepper';
import gasStationsImg from '../images/gas.jpg';
import restaurantsImg from '../images/restaurant.jpg';
import hotelsImg from '../images/hotel.jpg';
import { Card, CardMedia, Button } from '@material-ui/core';
import hotelIcon from '../assets/hotel.svg';
import gasIcon from '../assets/GasStation.svg';
import foodIcon from '../assets/restaurant.svg';
import { getIcon, getStarIcon, getPriceDisplay } from './timelineUtility';

//*************************************************************

const Node = ({ data, type, index }) => {
  // *** Redux ***
  const step = useSelector(state => state.stepper.step);
  const nodes = useSelector(state => state.stepper.nodes);
  const photoUrl = useSelector(
    state => state.stepper.suggestions?.[step]?.[type]?.[index]?.photoUrl
  );
  const dispatch = useDispatch();

  
  // *** Local State ***
  const [booked, setBooked] = useState(false);

  
  // *** Use Effect Hooks ***
  useEffect(() => {
    setBooked(false);
    // console.log(nodes[step]);

    if (nodes[step]) {
      nodes[step].forEach(e => {
        if (e.place_id === data.place_id) {
          setBooked(true);
        }
      });
    }
  }, [step, nodes]);

  // On Mount: Retrieve place image from Google and store in Redux
  useEffect(() => {
    dispatch(fetchImg(data, step, type, index));
  }, [data]);

  // Re-render node after photo is fetched
  useEffect(() => {}, [photoUrl]);

  
  // *** Actions ***
  const registerNode = () => {
    const payload = { ...data, type: type };
    dispatch(setNode(payload));
    setBooked(true);
  };

  const unregisterNode = async () => {
    await dispatch(unsetNode(data.place_id));
    setBooked(false);
  };

  // Default Images Icon Version for types
  const typeIcon = type => {
    if (type === 'restaurants')
      return <img src={foodIcon} className='node__image' />;
    if (type === 'gasStations')
      return <img src={gasIcon} className='node__image' />;
    if (type === 'hotels')
      return <img src={hotelIcon} className='node__image' />;
  };

  
  // *** JSX ***
  return (
    <Card elevation={3} className='node'>
      <div>
        {getStarIcon(data.rating)}
        {data.user_ratings_total} Reviews
      </div>
      <CardMedia>
        {photoUrl ? (
          <>
            <img
              src={photoUrl}
              className='node__image'
              referrerpolicy='no-referrer'
            />
          </>
        ) : (
          <>{typeIcon(type)}</>
        )}
      </CardMedia>

      <div className='node__title'>
        <h2>
          {data.name}
          <br />
          {getPriceDisplay(data.price_level || 2)}
        </h2>
      </div>

      {booked ? (
        <Button
          startIcon={getIcon(type)}
          size='large'
          onClick={unregisterNode}
          variant='outlined'
          style={{ backgroundColor: '#5ecc8a', color: 'white' }}>
          Unbook
        </Button>
      ) : (
        <Button variant='outlined' size='large' onClick={registerNode}>
          Book
        </Button>
      )}
    </Card>
  );
};

export default Node;
