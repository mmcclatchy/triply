import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import LoginForm from './Login/LoginForm';
import SignUpForm from './Signup/SignUpForm';
import ProtectedRoute from './authorization/ProtectedRoute';
import User from './Profile/User';
import Homepage from './Homepage/Homepage';
import { authenticate } from './services/auth';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const user = await authenticate();
      if (!user.errors) {
        setAuthenticated(true);
      }
      setLoaded(true);
    })();
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
      <ProtectedRoute
        path='/users/:userId'
        exact={true}
        authenticated={authenticated}>
        <User />
      </ProtectedRoute>
      <ProtectedRoute path='/' exact={true} authenticated={authenticated}>
        <Homepage setAuthenticated={setAuthenticated} />
      </ProtectedRoute>
    </BrowserRouter>
  );
}

export default App;
