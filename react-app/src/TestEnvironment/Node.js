import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setNode, unsetNode } from '../store/TestEnvironment/ReduxTest';

const Node = ({ data }) => {
  const step = useSelector(state => state.testenv.step);
  const [booked, setBooked] = useState(false);
  const dispatch = useDispatch();

  const registerNode = async () => {
    await dispatch(setNode(data));
    setBooked(true);
  };

  const unregisterNode = async () => {
    await dispatch(unsetNode(data.place_id));
    setBooked(false);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div>{data.name}</div>
      <div>
        {data.city},{data.state}
      </div>
      <img src={data.img_url} style={{ width: '70px', height: '70px' }} />
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
