import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import api from './middleware/api';
import utilities from './reducers/utilities';
import authentication from './reducers/authentication';
import directionsRedux from './reducers/directions';
import cars from './reducers/cars';
import stops from './reducers/stops';
import trips from './reducers/trips';
<<<<<<< HEAD
=======
import setDuration from "./reducers/setDurations"
>>>>>>> main

const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

<<<<<<< HEAD
export const reducer = combineReducers({
  authentication,
  utilities,
  directionsRedux,
  trips,
  stops,
  cars
=======
export const reducer = combineReducers({ 
  authentication, 
  utilities, 
  directionsRedux,
  trips,
  stops,
  cars,
  setDuration,
>>>>>>> main
});

const configureStore = initialState => {
  return createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk, api))
  );
};

export default configureStore;
