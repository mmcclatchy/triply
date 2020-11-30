import { SET_STOP, DELETE_STOP } from '../constants/constants';


// payloads have been normalized in the back end
export default function reducer(state = {}, { type, payload }) {
  Object.freeze(state);
  
  switch (type) {
    case SET_STOP: 
      return { ...state, payload };
    
    case DELETE_STOP:
      const newState = { ...state };
      delete newState[payload.id];
      return newState
    
    default:
      return state;
  }
}