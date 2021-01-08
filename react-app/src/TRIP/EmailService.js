import React from 'react';
import { useSelector } from 'react-redux';
import emailjs from 'emailjs-com';

const EmailService = () => {
  const name = useSelector(state => state.authentication.userName);

  const sendEmail = e => {
    e.preventDefault();
    console.log(e.target);
    // const EMAIL_API = process.env.REACT_APP_EMAIL_API;
    // emailjs.sendForm('gmail', 'template_q7rvdfp', e.target, EMAIL_API).then(
    //   result => {
    //     console.log(result.text);
    //   },
    //   error => {
    //     console.log(error.text);
    //   }
    // );
    // e.target.clear();
  };

  return (
    <div>
      <form onSubmit={sendEmail}>
        <input name='username' defaultValue={name} disabled />
        <input type='email' name='to_email'></input>
        <button type='submit'>Send</button>
      </form>
    </div>
  );
};

export default EmailService;
