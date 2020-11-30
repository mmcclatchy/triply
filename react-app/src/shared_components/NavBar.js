import React from 'react';
import './NavBar.css';
import { logout } from '../services/auth';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import View from '../shared_components/Drawer';
import { setAuth } from '../store/actions/authentication';
import { greeting } from '../services/utilities';

const NavBar = () => {
  const history = useHistory();
  const userId = useSelector(state => state.authentication.userId);
  const userName = useSelector(state => state.authentication.userName);
  const authenticated = useSelector(state => state.authentication.auth);
  const dispatch = useDispatch();

  const onLogout = async e => {
    await logout();
    dispatch(setAuth(false));
  };

  return (
    <div className='NavBar'>
      {authenticated ? (
        <>
          <div>
            {greeting()} {userName}
          </div>

          <View anchor='My Profile' variant='outlined' color='primary' />

          <Button
            variant='outlined'
            color='secondary'
            onClick={onLogout}
            className='homepage__button'>
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Button variant='outlined' className='homepage__button'>
            <View anchor='Login' />
          </Button>
          <Button variant='outlined' className='homepage__button'>
            <View anchor='Sign Up' />
          </Button>
        </>
      )}
    </div>
  );
};

export default NavBar;
