import React from 'react';
import { useSelector } from 'react-redux';
import emailjs from 'emailjs-com';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import './TripPage.css';

const EmailService = ({ tripUrl, closeModal }) => {
  const name = useSelector(state => state.authentication.userName);
  const destination = useSelector(state => state.directions.destination);
  const trip_name = 'Graduation Roadtrip'; // TODO: Add Ability to name Trips => Store in Redux

  const sendEmail = e => {
    e.preventDefault();
    const EMAIL_API = process.env.REACT_APP_EMAIL_API;
    console.log(EMAIL_API);
    emailjs
      .sendForm('service_gzgc1je', 'template_q7rvdfp', e.target, EMAIL_API)
      .then(
        result => {
          console.log(result.text);
        },
        error => {
          console.log(error.text);
        }
      );
    closeModal();
  };

  return (
    <div className="email__content">
      <form onSubmit={sendEmail} className='content__email-form'>
        <input name='name' defaultValue={name} className='hidden' />
        <input
          name='destination'
          defaultValue={destination}
          className='hidden'
        />
        <input name='link' defaultValue={tripUrl} className='hidden' />
        <input name='trip_name' defaultValue={trip_name} className='hidden' />
        <TextField type='email' name='to_email' label='Email Address' />
        <Button
          color='primary'
          variant='contained'
          disableElevation
          type='submit'
          className='email-form__button'
          style={{ marginTop: 20 }}
        >
          Send Email
        </Button>
      </form>
    </div>
  );
};

export default EmailService;
