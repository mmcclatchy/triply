import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import { createStore, compose, applyMiddleware } from 'redux'
import {reducer} from './store/configureStore'
import configureStore from './store/configureStore'
import { loadState, saveState } from './services/utilities'
import thunk from 'redux-thunk';

const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistedState = loadState();
const store = createStore(
  reducer,
  persistedState,
  composeEnhancers(applyMiddleware(thunk))
);
store.subscribe(() => {
  saveState({
    authentication: store.getState().authentication,
    directionsRedux: store.getState().directionsRedux

  });
});

// const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
