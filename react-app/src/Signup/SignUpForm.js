import React, { useState } from 'react';
import { Redirect, Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../services/auth';
import { TextField, Button } from '@material-ui/core';
import './SignUpForm.css';
import { setAuth, setName } from '../store/actions/authentication';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  button: {
    backgroundColor: 'var(--yellow)',
    width: 100,
    fontWeight: 'bold',

    '&:hover': {
      backgroundColor: 'var(--yellow-dark)',
    }
  },
  login_header: {
    fontFamily:
      'Circular, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif',
    fontSize: '40px',
    marginTop: '.5em',
    marginBottom: '.5em'
  },
  e_input: {
    marginTop: '2em',
    marginBottom: '2em'
  },
  normal_input: {
    marginBottom: '2em'
  }
});

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
  const classes = useStyles();

  const validate = () => {
    let usernameError = '';
    let emailError = '';
    let passwordError = '';

    if (!email.includes('@')) {
      emailError = 'Invalid Email';
    }
    if (emailError) {
      setEmailError(emailError);
    }
    if (username.length < 7) {
      usernameError = 'Username must have atleast 8 characters';
    }
    if (usernameError) {
      setUsernameError(usernameError);
    }
    if (password.length < 7) {
      passwordError = 'Password must have atleast 8 characters';
    }
    if (password !== repeatPassword) {
      passwordError = 'Passwords do not match';
    }
    if (passwordError) {
      setPasswordError(passwordError);
    }
    if (emailError || usernameError || passwordError) {
      return false;
    }
    return true;
  };
  const onSignUp = async e => {
    e.preventDefault();
    const isValid = validate();

    if (isValid) {
      const user = await signUp(username, email, password);
      if (!user.errors) {
        dispatch(setAuth(true));
        dispatch(setName(user.username));
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
      <img
        src='https://drama-deets.s3.amazonaws.com/triply_logo_contained.png'
        className='login__logo'
      />
      <div className={classes.login_header}>Save your adventures.</div>
      <form onSubmit={onSignUp}>
        <div>
          <TextField
            type='text'
            className={classes.normal_input}
            label='Username'
            name='username'
            onChange={updateUsername}
            value={username}
            required={true}></TextField>
        </div>
        {usernameError ? (
          <div style={{ color: 'red', fontSize: 12 }}>{usernameError}</div>
        ) : null}
        <div>
          <TextField
            type='text'
            name='email'
            label='Email'
            className={classes.normal_input}
            onChange={updateEmail}
            value={email}
            required={true}></TextField>
        </div>
        {emailError ? (
          <div style={{ color: 'red', fontSize: 12 }}>{emailError}</div>
        ) : null}
        <div>
          <TextField
            type='password'
            label='Password'
            className={classes.normal_input}
            name='password'
            onChange={updatePassword}
            value={password}
            required={true}></TextField>
        </div>
        <div>
          <TextField
            type='password'
            label='Confirm Password'
            className={classes.normal_input}
            name='repeat_password'
            onChange={updateRepeatPassword}
            value={repeatPassword}
            required={true}></TextField>
        </div>
        {passwordError ? (
          <div style={{ color: 'red', fontSize: 12 }}>{passwordError}</div>
        ) : null}
        <Button variant='contained' className={classes.button} type='submit'>
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm;
