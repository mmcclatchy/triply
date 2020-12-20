import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Node = ({ data, type, id }) => {
  const step = useSelector(state => state.testenv.step);
  const [disable, setDisable] = useState(false);

  const registerNode = async () => {
    console.log(step);
    const newNode = {};
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
