import React, { useEffect } from 'react';
import { authenticate } from '../services/auth';
import NavBar from '../shared_components/NavBar';
import './Homepage.css';

const Homepage = ({ authenticated, setAuthenticated, userId }) => {
  useEffect(() => {}, []);

  return (
    <div>
      <div className='homepage_body'>
        <div className='header__content'>
          <div className='logo'></div>
          <NavBar
            authenticated={authenticated}
            setAuthenticated={setAuthenticated}
            userId={userId}
          />
        </div>
        <div className='tag_container'>
          <h1 className='homepage__tagline'>Make every </h1>
          <h1 className='homepage__tagline'>drive an adventure</h1>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
