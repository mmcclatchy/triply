import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Stepper.css';
import { fetchImg, setNode, unsetNode } from '../store/actions/stepper';
import gasStationsImg from '../images/gas.jpg';
import restaurantsImg from '../images/restaurant.jpg';
import hotelsImg from '../images/hotel.jpg';

//*************************************************************

const Node = ({ data, type, index }) => {
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
    console.log(payload);
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
    <div className='node'>
      <div>{data.name}</div>

      {/* <img src={typeImg(type)} style={{ width: '70px', height: '70px' }} /> */}
      {place ? (
        <img
          src={photoUrl || typeImg(type)}
          style={{ width: '70px', height: '70px' }}
        />
      ) : null}
      {booked ? (
        <button onClick={unregisterNode} style={{ backgroundColor: 'green' }}>
          Booked
        </button>
      ) : (
        <button onClick={registerNode}>Select</button>
      )}
    </div>
  );
};

export default Node;
