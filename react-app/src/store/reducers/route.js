import { SET_ROUTE } from '../constants/constants';


// payloads have been normalized in the back end
export default function reducer(state = {}, { type, payload }) {
  Object.freeze(state);
  
  switch (type) {
    case SET_ROUTE: 
      return { ...state, payload };
    
    default:
      return state;
  }
}