import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { login } from '../services/auth';
import { useDispatch, useSelector } from 'react-redux';
import { setId, setName, setAuth } from '../store/actions/authentication';
import { TextField, Button } from '@material-ui/core';
import './LoginForm.css';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  button: {
    background: 'linear-gradient(45deg, #E9F61C  30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'Black',
    height: 48,
    padding: '0 30px'
  },
  login_header: {
    fontFamily:
      'Circular, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif',
    fontSize: '60px'
  },
  email_input: {
    marginTop: '2em',
    marginBottom: '2em'
  },
  password_input: {
    marginBottom: '2em'
  }
});

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('demo@aa.io');
  const [password, setPassword] = useState('password');
  const classes = useStyles();
  const dispatch = useDispatch();
  const authenticated = useSelector(state => state.authentication.auth);

  const onLogin = async e => {
    e.preventDefault();
    const user = await login(email, password);
    if (!user.errors) {
      dispatch(setId(user.id));
      dispatch(setName(user.username));
      dispatch(setAuth(true));
    } else {
      setErrors(user.errors);
    }
  };

  const updateEmail = e => {
    setEmail(e.target.value);
  };

  const updatePassword = e => {
    setPassword(e.target.value);
  };

  if (authenticated) {
    return <Redirect to='/' />;
  }

  return (
    <div className='login__container'>
      <div className='login__logo' />
      <div className={classes.login_header}>Welcome Back!</div>
      <form onSubmit={onLogin}>
        <div style={{ color: 'red' }}>
          {errors.map(error => (
            <div>{error}</div>
          ))}
        </div>
        <div>
          <TextField
            label='Email'
            name='email'
            className={classes.email_input}
            type='text'
            placeholder='Email'
            value={email}
            onChange={updateEmail}
            required={true}
          />
        </div>
        <div>
          <TextField
            label='Password'
            className={classes.password_input}
            name='password'
            type='password'
            placeholder='Password'
            value={password}
            onChange={updatePassword}
            required={true}
          />
          <div></div>
          <Button variant='contained' type='submit' className={classes.button}>
            Login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
