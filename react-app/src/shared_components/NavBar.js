import React from 'react';
import DropDown from './DropDown';
import './NavBar.css';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NavBar = ({ authenticated, setAuthenticated }) => {
  const history = useHistory();
  const userId = useSelector(state => state.authentication.userId);

  const login_form = () => {
    history.push('/login');
  };

  const signup_form = () => {
    history.push('/sign-up');
  };

  return (
    <div className='NavBar'>
      {authenticated ? (
        <DropDown
          authenticated={authenticated}
          setAuthenticated={setAuthenticated}
          userId={userId}
        />
      ) : (
        <>
          <Button variant='contained' onClick={login_form}>
            Log In
          </Button>
          <Button variant='contained' onClick={signup_form}>
            Sign Up
          </Button>
        </>
      )}
    </div>
  );
};

export default NavBar;
