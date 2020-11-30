import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { showForm, hideForm } from '../store/actions/utilities';
import './User.css';
import TestForm from '../Car/TestForm';

function User({ userId }) {
  const [user, setUser] = useState({});
  const [cars, setCars] = useState([]);
  const dispatch = useDispatch();
  const visible = useSelector(state => state.utilities.formVisible);

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/users/${userId}`);
      const user = await response.json();
      setUser(user);
    })();
  }, []);

  useEffect(() => {
    const getCars = async () => {
      const response = await fetch(`/api/users/${userId}/cars`);
      const data = await response.json();
      setCars(data.cars);
    };
    getCars();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div>
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
      <div>
        <h3>{user.username}'s Cars</h3>
        {cars &&
          Object.keys(cars).map(key => {
            const current = cars[`${key}`];

            return (
              <div key={current.id}>
                <h4>
                  {current.year} {current.make} {current.model} ({current.mpg}{' '}
                  mpg)
                </h4>
              </div>
            );
          })}
      </div>

      {visible ? (
        <TestForm />
      ) : (
        <button onClick={() => dispatch(showForm())}>Add a New Car</button>
      )}
    </div>
  );
}
export default User;
