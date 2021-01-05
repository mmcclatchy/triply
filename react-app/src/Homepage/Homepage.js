import React, { useEffect } from 'react';
import { authenticate } from '../services/auth';
import NavBar from '../shared_components/NavBar';
import './Homepage.css';
import RouteForm from '../Map/RouteForm';
import { getTrips } from '../store/actions/trips';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

const Homepage = ({ authenticated, setAuthenticated }) => {
  const userId = useSelector(state => state.authentication.userId);
  const trips = useSelector(state => state.trips.trips);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {}, []);
  useEffect(() => {
    // console.log(userId);
    // console.log('trippppppssss', trips);
    dispatch(getTrips(userId));
  }, []);

  return (
    <div className='homepage_body'>
      <div className='header__content'>
        <div className='logo'></div>
        <div className='navbar_container'>
          <NavBar
            authenticated={authenticated}
            setAuthenticated={setAuthenticated}
            userId={userId}
          />
        </div>
      </div>
      <div className='form_header'>Plan your next Road trip</div>
      <RouteForm />
      {/* <div className='tag_container'> */}
      <h1 className='homepage__tagline'>Make every </h1>
      <h1 className='homepage__tagline2'>drive an adventure</h1>
      {/* </div> */}
    </div>
  );
};

export default Homepage;
