import { API } from '../constants/constants';
const baseUrl = process.env.REACT_APP_BASE_URL



//* API Middleware receives an action object and parses the data to make a specific fetch request
const api = dispatch => next => async action => {

  if (action.type !== API) return next(action);
  
  //* Payload will determine the fetch call and what is being dispatched
  const { endpoint, fetchMethod, body, success } = action.payload;
  
  const response = await fetch(`${baseUrl}/${endpoint}`, {
    method: fetchMethod,
    'Content-Type': 'application/json', 
    body: body
  });
  if (response.ok) {
    const data = await response.json();
    
    dispatch(success(data))
  }
  next(action);
}

export default api;