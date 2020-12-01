import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';

const BookButton = ({
  registerRestaurant,
  registerGas,
  registerHotel,
  index,
  type,
  booked,
  refresh
}) => {
  const [reg, setReg] = useState(false);

  useEffect(() => {
    setReg(false);
    if (booked) setReg(true);
  }, [refresh, booked]);

  return (
    <>
      {reg ? (
        <Button color='primary'>Booked</Button>
      ) : (
        <>
          {type === 'Restaurant' ? (
            <Button onClick={() => registerRestaurant(index)}>Book</Button>
          ) : null}
          {type === 'GasStation' ? (
            <Button onClick={() => registerGas(index)}>Book</Button>
          ) : null}
          {type === 'Hotel' ? (
            <Button onClick={() => registerHotel(index)}>Book</Button>
          ) : null}{' '}
        </>
      )}
    </>
  );
};

export default BookButton;
