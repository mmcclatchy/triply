import React from 'react';
import Header from '../shared_components/Header';

const Homepage = ({ setAuthenticated, userId }) => {
  return (
    <div>
      <Header setAuthenticated={setAuthenticated} userId={userId} />
      <h1>Welcome to Triply!</h1>
    </div>
  );
};

export default Homepage;
