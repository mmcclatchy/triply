import React, { useEffect } from 'react';
import { authenticate } from '../services/auth';
import Header from '../shared_components/Header';

const Homepage = ({ authenticated, setAuthenticated, userId }) => {
  useEffect(() => {}, []);

  return (
    <div>
      <Header
        authenticated={authenticated}
        setAuthenticated={setAuthenticated}
        userId={userId}
      />
      <h1>Welcome to Triply!</h1>
    </div>
  );
};

export default Homepage;
