import { API, SET_DIRECTIONS, ADD_SUG } from '../constants/constants';
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
  
    
    console.log("API => DIRECTIONS: ", directions);
    
    
    if (directions) dispatch({ 
      type: SET_DIRECTIONS, 
      payload: {
        itinerary: await JSON.parse(directions.itinerary),
        foodQuery: directions.foodQuery,
      }
    });
    if (suggestions) dispatch({ type: ADD_SUG, payload: suggestions });

    dispatch({ type: actionConst, payload });
  }
  next(action);
};

export default api;
