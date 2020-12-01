import React, { useState } from 'react';
import { Button } from '@material-ui/core';

const BookButton = () => {
  const [book, setBook] = useState(false);

  return (
    <>
      {book ? (
        <Button
          onClick={() => setBook(false)}
          variant='contained'
          color='primary'>
          Booked!
        </Button>
      ) : (
        <Button
          onClick={() => setBook(true)}
          variant='contained'
          color='secondary'>
          Book
        </Button>
      )}
    </>
  );
};

export default BookButton;
