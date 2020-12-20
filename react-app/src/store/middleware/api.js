import { API, SET_DIRECTIONS, SET_SUGGESTIONS } from '../constants/constants';
const baseUrl = process.env.REACT_APP_BASE_URL;

//* API Middleware receives an action object and parses the data to make a specific fetch request
const api = ({ dispatch, getState }) => next => async action => {
  
  
  // console.log('API ACTION: ', action)
  
  
  if (action.type !== API) return next(action);

  //* Payload will determine the fetch call and what is being dispatched
  const { endpoint, method, body, actionConst } = action.payload;
  
  
  console.log('api middleware', action.payload);
  
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: body
  });

  if (response.ok) {
    const { payload, suggestions, directions } = await response.json();
  
    
    // console.log("SUGGESTIONS FROM API: ", suggestions);
    
    
    if (directions) dispatch({ type: SET_DIRECTIONS, payload: directions });
    if (suggestions) dispatch({ type: SET_SUGGESTIONS, payload: suggestions });

    dispatch({ type: actionConst, payload });
  }
  next(action);
};

export default api;
