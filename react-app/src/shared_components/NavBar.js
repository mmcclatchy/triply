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
          <div className="greeting_container">
            {greeting()} {userName}
          </div>
         <Button
            className="profile_button"
              style={{
              fontWeight: "bold",
              marginRight: "3em",
              marginTop: "1.75em"
            }}>
           <View anchor='My Profile'/>
          </Button>

          <Button
            variant='outlined'
            style={{
              backgroundColor: "yellow",
              marginRight: "3em",
              fontWeight: "bold",
              marginTop:"1em"
            }}
            onClick={onLogout}
            className='homepage__button'>
            Logout
          </Button>
        </>
      ) : (
        <>
            <Button
              variant='outlined'
              style={{
                backgroundColor: "yellow",
                fontWeight: "bold",
                marginRight: "3em",
                marginTop: "1em",
                height: "3em",
              }}
              className='homepage__button'>
            <View anchor='Login' />
          </Button>
            <Button
              variant='outlined'
              className='homepage__button'
              style={{
                backgroundColor: "yellow",
                fontWeight: "bold",
                height: "3em",
                marginRight: "3em",
                marginTop:"1em"
              }}>
            <View anchor='Sign Up' />
          </Button>
        </>
      )}
    </div>
  );
};

export default NavBar;
