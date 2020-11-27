import React from 'react';
import { AppBar } from '@material-ui/core';
import cover from '../assets/triply_cover.jpeg';
import NavBar from './NavBar';
import './Header.css';

const Header = ({ authenticated, setAuthenticated, userId }) => {
  return (
    <div>
      <AppBar
        postion='sticky'
        style={{
          backgroundImage: `url(${cover})`,
          backgroundSize: '100%',
          backgroundPosition: 'center',
          height: '650px'
        }}>
        <div className='header__content'>
          <div className='logo'></div>
          <h1>Welcome to Triply!</h1>
          <NavBar
            authenticated={authenticated}
            setAuthenticated={setAuthenticated}
            userId={userId}
          />
        </div>
      </AppBar>
    </div>
  );
};

export default Header;
