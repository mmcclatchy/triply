import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './User.css';
import CarForm from './CarForm';

function User() {
  const [user, setUser] = useState({});
  const [cars, setCars] = useState({});
  // Notice we use useParams here instead of getting the params
  // From props.
  const { userId } = useParams();

  useEffect(() => {
    if (!userId) {
      return;
    }
    (async () => {
      const response = await fetch(`/api/users/${userId}`);
      const user = await response.json();
      setUser(user);
    })();
  }, [userId]);


//   useEffect(() => {
//     const getCars = async () => {
//       const response = await fetch(`/api/users/${userId}/cars`);
//       const cars = await response.json();
//       setCars(cars);
//     };
//     getCars();
//   });


  if (!user) {
    return null;
  }

  return (
    <div>
      <Link to='/'>
        <div className='profile__logo' />
      </Link>
      <ul>
        <li>
          <strong>User Id</strong> {userId}
        </li>
        <li>
          <strong>Username</strong> {user.username}
        </li>
        <li>
          <strong>Email</strong> {user.email}
        </li>
      </ul>

      <button>Add a New Car</button>
      <CarForm />

    </div>
  );
}
export default User;
