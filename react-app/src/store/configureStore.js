import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import utilities from './reducers/utilities';
import authentication from './reducers/authentication';
import directionsRedux from './reducers/directions';
import setDuration from "./reducers/setDurations"

const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducer = combineReducers({ authentication, utilities, directionsRedux, setDuration });

const configureStore = initialState => {
  return createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk))
  );
};

export default configureStore;
