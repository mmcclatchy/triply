import React, { useState, forwardRef } from 'react';
import { Button, Dialog, Slide, TextField } from '@material-ui/core';
import QRCode from 'qrcode.react';
import EmailService from './EmailService';

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
        <div className='endmodal__container'>
          <div className='endmodal__qr'>
            <h1>Send to your Mobile Device</h1>
            <QRCode value='https://triplyroadtripapp.herokuapp.com/' />
            <h1>Scan QR</h1>
          </div>
          <div className='endmodal__email'>
            <h1>Send to Email</h1>
            <EmailService />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
