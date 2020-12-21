import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { loadState, saveState } from '../services/utilities';
import thunk from 'redux-thunk';
import utilities from './reducers/utilities';
import authentication from './reducers/authentication';
import directionsRedux from './reducers/directions';
import api from './middleware/api';
import cars from './reducers/cars';
import stops from './reducers/stops';
import trips from './reducers/trips';
import setDuration from './reducers/setDurations';
import suggestions from './reducers/suggestions';
import stepper from './reducers/stepper';
// import timeline from './reducers/timeline';
import testenv from './TestEnvironment/ReduxTest';

const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const initialState = {};

export const reducer = combineReducers({
  authentication,
  utilities,
  directionsRedux,
  trips,
  stops,
  cars,
  setDuration,
  suggestions,
  stepper,
  // timeline,
  testenv
});

const persistedState = loadState();
const store = createStore(
  reducer,
  // initialState,
  persistedState,
  composeEnhancers(applyMiddleware(thunk, api))
);

store.subscribe(() => {
  saveState({
    authentication: store.getState().authentication,
    utilities: store.getState().utilities,
    directionsRedux: store.getState().directionsRedux,
    trips: store.getState().trips,
    stops: store.getState().stops,
    cars: store.getState().cars,
    setDuration: store.getState().setDuration,
    // stepper: store.getState().stepper,
  });
});

export default store;
