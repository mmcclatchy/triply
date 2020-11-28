import React from 'react';
import './NavBar.css';
import { logout } from '../services/auth';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import View from '../Profile/Drawer';

const NavBar = ({ authenticated, setAuthenticated }) => {
  const history = useHistory();
  const userId = useSelector(state => state.authentication.userId);
  const userName = useSelector(state => state.authentication.userName);
  const onLogout = async e => {
    await logout();
    setAuthenticated(false);
  };

  return (
    <div className='NavBar'>
      {authenticated ? (
        <>
          <div>Welcome {userName}</div>

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
            <View anchor='Login' setAuthenticated={setAuthenticated} />
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
