import { API } from '../constants/constants';
const baseUrl = process.env.REACT_APP_BASE_URL


//* API Middleware receives an action object and parses the data to make a specific fetch request
const api = dispatch => next => async action => {

  if (action.type !== API) return next(action);
  
  //* Payload will determine the fetch call and what is being dispatched
  const { endpoint, method, body, actionConst } = action.payload;
  
  
  const response = await fetch(`${baseUrl}/${endpoint}`, {
    method: method,
    'Content-Type': 'application/json', 
    body: body
  });
  
  
  if (response.ok) {
    const payload = await response.json();
    
    dispatch({ type: actionConst, payload })
  }
  next(action);
}

export default api;