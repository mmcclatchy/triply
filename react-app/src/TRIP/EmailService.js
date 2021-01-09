import React from 'react';
import { useSelector } from 'react-redux';
import emailjs from 'emailjs-com';
import './TripPage.css';

const EmailService = () => {
  const name = useSelector(state => state.authentication.userName);
  const destination = useSelector(state => state.directions.destination);
  const link = 'https://triplyroadtripapp.herokuapp.com/'; // TODO: Add Directions URL from Algo
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
  };

  return (
    <div>
      <form onSubmit={sendEmail}>
        <input name='name' defaultValue={name} className='hidden' />
        <input
          name='destination'
          defaultValue={destination}
          className='hidden'
        />
        <input name='link' defaultValue={link} className='hidden' />
        <input name='trip_name' defaultValue={trip_name} className='hidden' />
        <input type='email' name='to_email'></input>
        <button type='submit'>Send</button>
      </form>
    </div>
  );
};

export default EmailService;
