import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Stepper.css';
import { fetchImg, setNode, unsetNode } from '../store/actions/stepper';
import gasStationsImg from '../images/gas.jpg';
import restaurantsImg from '../images/restaurant.jpg';
import hotelsImg from '../images/hotel.jpg';
import { Card, CardMedia, Button } from '@material-ui/core';
import { getIcon, getStarIcon, getPriceDisplay } from './timelineUtility';

//*************************************************************

const Node = ({ data, type, index }) => {
  console.log(data);
  // *** Redux ***
  const step = useSelector(state => state.stepper.step);
  const nodes = useSelector(state => state.stepper.nodes);
  const place = useSelector(
    state => state.stepper.suggestions[step][type][index]
  );
  const photoUrl = useSelector(
    state => state.stepper.suggestions[step][type][index].photoUrl
  );
  const dispatch = useDispatch();

  // *** Local State ***
  const [booked, setBooked] = useState(false);

  // *** Use Effect Hooks ***
  useEffect(() => {
    setBooked(false);
    console.log(nodes[step]);

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
    // if (place.photoUrl) return;
    dispatch(fetchImg(data, step, type, index));
  }, []);

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

  // Default Images for types
  const typeImg = type => {
    if (type === 'restaurants') return restaurantsImg;
    if (type === 'gasStations') return gasStationsImg;
    if (type === 'hotels') return hotelsImg;
  };

  return (
    <Card elevation={3} className='node'>
      <div>
        {getStarIcon(data.rating)}
        {data.user_ratings_total} Reviews
      </div>
      <CardMedia>
        {place ? (
          <img src={photoUrl || typeImg(type)} className='node__image' />
        ) : null}
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
