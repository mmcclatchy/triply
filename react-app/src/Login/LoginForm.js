import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { login } from '../services/auth';
import { useDispatch, useSelector } from 'react-redux';
import { setId, setName, setAuth } from '../store/actions/authentication';
import './LoginForm.css';

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('demo@aa.io');
  const [password, setPassword] = useState('password');
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
      <h1>Coming Soon!</h1>
      <form onSubmit={onLogin}>
        <div>
          {errors.map(error => (
            <div>{error}</div>
          ))}
        </div>
        <div>
          <label htmlFor='email'>Email</label>
          <input
            name='email'
            type='text'
            placeholder='Email'
            value={email}
            onChange={updateEmail}
          />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            name='password'
            type='password'
            placeholder='Password'
            value={password}
            onChange={updatePassword}
          />
          <div></div>
          <button type='submit'>Login</button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
