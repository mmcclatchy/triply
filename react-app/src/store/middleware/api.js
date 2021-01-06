import { API, SET_DIRECTIONS, ADD_SUG, TRIP_COMPLETE } from '../constants/constants';
const baseUrl = process.env.REACT_APP_BASE_URL;

//* API Middleware receives an action object and parses the data to make a specific fetch request
const api = ({ dispatch, getState }) => next => async action => {
  
  
  // console.log('API ACTION: ', action)
  
  
  if (action.type !== API) return next(action);

  //* Payload will determine the fetch call and what is being dispatched
  const { endpoint, method, body, actionConst } = action.payload;
  
  
  
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: body
  });
  
  if (response.ok) {
    const { 
      payload, 
      suggestions, 
      directions, 
      tripComplete 
    } = await response.json(); 
    
    if (directions) dispatch({ 
      type: SET_DIRECTIONS, 
      payload: {
        itinerary: await JSON.parse(directions.itinerary),
        foodQuery: directions.foodQuery,
        avoidTolls: directions.avoidTolls,
      }
    });
    
    console.log('api middleware: suggestions: ', suggestions);
    
    if (suggestions) dispatch({ type: ADD_SUG, payload: suggestions });
    
    dispatch({ type: TRIP_COMPLETE, payload: tripComplete });
    dispatch({ type: actionConst, payload });
  }
  next(action);
};

export default api;
