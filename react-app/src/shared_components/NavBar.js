import React from 'react';
import { NavLink } from 'react-router-dom';
import LogoutButton from './LogoutButton';

const NavBar = ({ setAuthenticated, userId }) => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to='/' exact={true} activeClassName='active'>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to='/sign-up' exact={true} activeClassName='active'>
            Sign Up
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/profile/${userId}`}
            exact={true}
            activeClassName='active'>
            My Profile
          </NavLink>
        </li>
        <li>
          <LogoutButton setAuthenticated={setAuthenticated} />
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
