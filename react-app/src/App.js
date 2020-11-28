import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import LoginForm from './Login/LoginForm';
import SignUpForm from './Signup/SignUpForm';
import Map from './Map/Map';
import { setId, setName } from './store/actions/authentication';
import { useDispatch } from 'react-redux';
import ProtectedRoute from './authorization/ProtectedRoute';
import View from './Profile/Drawer';
import Homepage from './Homepage/Homepage';
import { authenticate } from './services/auth';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    authenticate().then(user => {
      if (!user.errors) {
        setAuthenticated(true);
        dispatch(setId(user.id));
        dispatch(setName(user.username));
      }
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <Route path='/login' exact={true}>
        <LoginForm
          authenticated={authenticated}
          setAuthenticated={setAuthenticated}
        />
      </Route>
      <Route path='/sign-up' exact={true}>
        <SignUpForm
          authenticated={authenticated}
          setAuthenticated={setAuthenticated}
        />
      </Route>

      <Route path='/map' exact={true}>
        <Map />
      </Route>

      <Route path='/profile/:userId' authenticated={authenticated}>
        <View />
      </Route>

      <Route path='/' exact={true} authenticated={authenticated}>
        <Homepage
          authenticated={authenticated}
          setAuthenticated={setAuthenticated}
        />
      </Route>
    </BrowserRouter>
  );
}

export default App;
