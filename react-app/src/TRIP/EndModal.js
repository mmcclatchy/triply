import React, { useState, forwardRef } from 'react';
import { useSelector } from 'react-redux';

import { Button, Dialog, Slide, Link, TextField } from '@material-ui/core';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import LanguageIcon from '@material-ui/icons/Language';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
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
            <div className='qr__icon'>
              <PhoneAndroidIcon />
            </div>
            <div className="qr__content">
              <h3>Send to your Mobile Device</h3>
              <QRCode value={tripUrl} />
              <h3>Scan QR</h3>
            </div>
          </div>
          
          <div className="endmodal_link">
            <div className='link__icon' >
              <LanguageIcon />
            </div>
            <Button 
              href={tripUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              color='primary'
              variant='contained'
            >
              Link to Google Maps
            </Button>
          </div>
          
          <div className='endmodal__email'>
            <div className='email__icon' >
              <MailOutlineIcon />
            </div>
            <div className="email__content">
              <h3>Send to Email</h3>
              <EmailService tripUrl={tripUrl} closeModal={handleClose} />
            </div>
          </div>
          
        </div>
      </Dialog>
    </div>
  );
}
