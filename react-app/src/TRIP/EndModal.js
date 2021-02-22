import React, { useState, forwardRef } from 'react';
import { useSelector } from 'react-redux';

import { Button, Dialog, Slide, Link, TextField } from '@material-ui/core';
import website from '../assets/website.jpg'
import phone from '../assets/phone.jpg'
import email from '../assets/email.jpg'
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
          
          <h1 className='endmodal__title'>How do you want to get your itinerary?</h1>
          
          <div className='endmodal__qr'>
            <div className='qr__img' >
              <img src={phone} alt="phone picture"/>
            </div>
            <div className="qr__content">
              <div className='qr__heading'>Scan QR to your Mobile Device</div>
              <QRCode value={tripUrl} />
            </div>
          </div>
          
          <div className="endmodal__link">
            <div className='link__img' >
              <img src={website} alt="website picture"/>
            </div>
            <Button 
              href={tripUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              color='primary'
              variant='contained'
              className='link__content'
              style={{ marginLeft: 35 }}
            >
              Link to Google Maps
            </Button>
          </div>
          
          <div className='endmodal__email'>
            <div className='email__img' >
              <img src={email} alt="email picture"/>
            </div>
            
            <EmailService tripUrl={tripUrl} closeModal={handleClose} />
            
          </div>
          
        </div>
      </Dialog>
    </div>
  );
}
