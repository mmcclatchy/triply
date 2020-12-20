import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setNode } from '../store/TestEnvironment/ReduxTest';

const Node = ({ data }) => {
  const step = useSelector(state => state.testenv.step);
  const [disable, setDisable] = useState(false);
  const dispatch = useDispatch();

  const registerNode = async () => {
    console.log(data);
    dispatch(setNode(data));
  };

  return (
    <div style={{ display: 'flex' }}>
      <div>{data.name}</div>
      <div>
        {data.city},{data.state}
      </div>
      <img src={data.img_url} style={{ width: '70px', height: '70px' }} />
      <button disabled={disable} onClick={registerNode}>
        Select
      </button>
    </div>
  );
};

export default Node;
