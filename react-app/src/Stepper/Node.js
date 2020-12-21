import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setNode, unsetNode } from '../store/actions/stepper';

const Node = ({ data }) => {
  const step = useSelector(state => state.stepper.step);
  const nodes = useSelector(state => state.stepper.nodes);
  const [booked, setBooked] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setBooked(false);
    if (nodes[step]) {
      nodes[step].map(e => {
        if (e.place_id === data.place_id) {
          return setBooked(true);
        }
      });
    }
  }, [step, nodes]);

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
