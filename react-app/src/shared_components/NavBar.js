import React from 'react';
import './NavBar.css';
import { logout } from '../services/auth';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import View from '../shared_components/Drawer';

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
          <div className="header_logo">Welcome {userName}</div>

          <View anchor='My Profile'
            className="profile_button"
            variant='contained'
            style={{backgroundColor: "yellow"}}/>

          <Button
            variant='outlined'
            style={{backgroundColor: "yellow", marginRight:"2em"}}
            onClick={onLogout}
            className='homepage__button'>
            Sign Out
          </Button>
        </>
      ) : (
        <>
            <Button
              variant='outlined'
              style={{backgroundColor: "yellow"}}
              className='homepage__button'>
            <View anchor='Login' setAuthenticated={setAuthenticated} />
          </Button>
            <Button
              variant='outlined'
              className='homepage__button'
              style={{backgroundColor: "yellow"}}>
            <View anchor='Sign Up' />
          </Button>
        </>
      )}
    </div>
  );
};

export default NavBar;
