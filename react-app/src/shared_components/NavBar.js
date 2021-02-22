import React from 'react';
import './NavBar.css';
import { logout } from '../services/auth';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import View from '../shared_components/Drawer';
import { setAuth, setName, setId } from '../store/actions/authentication';
import {
  setOriginAction,
  setDestinationAction,
  setStartTimeAction,
  setDistanceAction,
  setDurationAction,
  clearDirections
} from '../store/actions/directions';
import { greeting } from '../services/utilities';
import { clearTrips } from '../store/actions/trips';
import { clearStepper } from '../store/actions/stepper';

const NavBar = () => {
  const history = useHistory();
  const userId = useSelector(state => state.authentication.userId);
  const userName = useSelector(state => state.authentication.userName);
  const authenticated = useSelector(state => state.authentication.auth);
  const dispatch = useDispatch();

  const onLogout = async e => {
    await logout();
    dispatch(setAuth(false));
    dispatch(setOriginAction(''));
    dispatch(setDestinationAction(''));
    dispatch(setStartTimeAction(''));
    dispatch(setDistanceAction(''));
    dispatch(setDurationAction(''));
    dispatch(setName(''));
    dispatch(setId(''));
    dispatch(clearTrips());
    dispatch(clearDirections());
    dispatch(clearStepper());
  };

  return (
    <div className='NavBar'>
      {authenticated ? (
        <>
          <div className='greeting_container'>
            {greeting()} {userName}
          </div>
          <Button
            className='profile_button'
            style={{
              fontWeight: 'bold',
              marginRight: '3em',
              marginTop: '1.75em',
              backgroundColor: 'rgba(0, 0, 0, 0)'
            }}>
            <View anchor='My Profile' />
          </Button>

          <Button
            variant='contained'
            style={{
              backgroundColor: 'var(--yellow)',
              marginRight: '3em',
              fontWeight: 'bold',
              marginTop: '1em',
              width: '120px'
            }}
            onClick={onLogout}
            className='homepage__button'>
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0)',
              fontWeight: 'bold',
              marginRight: '3em',
              marginTop: '1em',
              height: '3em',
              width: '125px'
            }}
            className='homepage__button'>
            <View anchor='Login' />
          </Button>
          <Button
            className='homepage__button'
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0)',
              fontWeight: 'bold',
              height: '3em',
              marginRight: '3em',
              marginTop: '1em',
              width: '125px'
            }}>
            <View anchor='Sign Up' />
          </Button>
        </>
      )}
    </div>
  );
};

export default NavBar;
