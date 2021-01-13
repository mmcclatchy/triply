import React, { useState, forwardRef } from 'react';
import { useSelector } from 'react-redux';

import { Button, Dialog, Slide, Link, TextField } from '@material-ui/core';
import QRCode from 'qrcode.react';
import EmailService from './EmailService';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export default function EndModal() {
  // *** Redux ***
  const tripUrl = useSelector(state => state.directions.tripUrl);
  
  
  // *** Local State ***
  const [open, setOpen] = useState(false);

  
  // *** Helper Functions ***
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  
  // *** JSX ***
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
            <QRCode value={tripUrl} />
            <h1>Scan QR</h1>
          </div>
          <div className="endmodal_link">
            <Button 
              href={tripUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              color='primary'
              variant='contained'
            >Link</Button>
          </div>
          <div className='endmodal__email'>
            <h1>Send to Email</h1>
            <EmailService tripUrl={tripUrl}/>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
