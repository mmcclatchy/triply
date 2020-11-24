import React from "react";
import Header from "../shared_components/Header";

const Homepage = ({ setAuthenticated }) => {
  return (
    <div>
      <Header setAuthenticated={setAuthenticated} />
      <h1>Welcome to Triply!</h1>
    </div>
  );
};

export default Homepage;
