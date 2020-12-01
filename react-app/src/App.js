import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import LoginForm from './Login/LoginForm';
import SignUpForm from './Signup/SignUpForm';
import { setId, setName } from './store/actions/authentication';
import { useDispatch } from 'react-redux';
import View from './shared_components/Drawer';
import Homepage from './Homepage/Homepage';
import { authenticate } from './services/auth';
import TripPage from './TRIP/TripPage';
import { setAuth } from './store/actions/authentication';
import SuggestionStepper from './Suggestions/SuggestionStepper';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    authenticate().then(user => {
      if (!user.errors) {
        dispatch(setAuth(true));
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

      <Route path='/create-trip' exact={true}>
        <TripPage />
      </Route>

      <Route path='/stepper' exact={true}>
        <SuggestionStepper />
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
