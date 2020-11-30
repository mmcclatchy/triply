import React, { useState } from 'react';
import { Redirect, Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../services/auth';
import './SignUpForm.css';
import { setAuth, setId } from '../store/actions/authentication';

const SignUpForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();

  const validate = () => {
    let usernameError = "";
    let emailError = "";
    let passwordError = "";

    if (!email.includes("@")) {
      emailError = "Invalid Email"
    }
   if (emailError) {
      setEmailError(emailError)
      return false
    }
   if (username.length < 7) {
     usernameError = "Username must have atleast 8 characters"
   }
   if (usernameError) {
     setUsernameError(usernameError)
     return false
   }
   if (password.length < 7) {
     passwordError = "Password must have atleast 8 characters"
     return false
   }
   return true
  }
  const onSignUp = async e => {
    e.preventDefault();
    const isValid = validate()

    if (isValid) {
      const user = await signUp(username, email, password);
      if (!user.errors) {
        dispatch(setAuth(true));
        dispatch(setId(user.username));
      }
    }
    history.push('/');
  };

  const updateUsername = e => {
    setUsername(e.target.value);
  };

  const updateEmail = e => {
    setEmail(e.target.value);
  };

  const updatePassword = e => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = e => {
    setRepeatPassword(e.target.value);
  };

  return (
    <div className='signup__form'>
      <Link to='/'>
        <div className='signup__logo' />
      </Link>
      <form onSubmit={onSignUp}>
        <div>
          <label>User Name</label>
          <input
            type='text'
            name='username'
            onChange={updateUsername}
            value={username}></input>
        </div>
        {usernameError ?
          <div style={{ color: "red", fontSize: 12 }} >{usernameError}</div>
          : null}
        <div>
          <label>Email</label>
          <input
            type='text'
            name='email'
            onChange={updateEmail}
            value={email}></input>
        </div>
        {emailError ?
          <div style={{ color: "red", fontSize: 12 }} >{emailError}</div>
          : null}
        <div>
          <label>Password</label>
          <input
            type='password'
            name='password'
            onChange={updatePassword}
            value={password}></input>
        </div>
        <div>
          <label>Repeat Password</label>
          <input
            type='password'
            name='repeat_password'
            onChange={updateRepeatPassword}
            value={repeatPassword}
            required={true}></input>
        </div>
        {passwordError ?
          <div style={{ color: "red", fontSize: 12 }} >{passwordError}</div>
          : null}
        <button type='submit'>Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;
