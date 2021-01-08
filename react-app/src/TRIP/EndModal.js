import React, { useState, forwardRef } from 'react';
import { Button, Dialog, Slide } from '@material-ui/core';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export default function EndModal() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant='outlined' color='primary' onClick={handleClickOpen}>
        Click to View Options
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        maxWidth='lg'
        onClose={handleClose}>
        <div style={{ width: '500px', height: '400px' }}>
          <div style={{ width: '80%', height: '80%', margin: 'auto' }}>
            <h1>Options</h1>
            <li>QR CODE to Phone</li>
            <li>Email Google Directions</li>
            <li>Text to Phone</li>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
