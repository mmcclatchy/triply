import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { login } from '../services/auth';
import { useDispatch, useSelector } from 'react-redux';
import { setId, setName, setAuth } from '../store/actions/authentication';
import { TextField, Button } from '@material-ui/core';
import './LoginForm.css';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    margin: '5% 0',
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    // width: '100%',
  },
  logo: {
    marginBottom: '10%',
  },
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
    fontSize: '2rem',
    textAlign: 'center',
    marginTop: '20px'
  },
  form: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
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
    <div className={classes.container}>
      <img
        src='https://drama-deets.s3.amazonaws.com/triply_logo_contained.png'
        className={classes.logo}
      />
      <div className={classes.login_header}>Welcome Back!</div>
      <form onSubmit={onLogin} className={classes.form}>
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
        </div>
        <Button variant='contained' type='submit' className={classes.button}>
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
