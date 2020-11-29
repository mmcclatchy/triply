import { SET_TRIP } from '../actions/utilities';


// payloads have been normalized in the back end
export default function reducer(state, { type, payload }) {
  Object.freeze(state);
  
  switch (action.type) {
    case SET_TRIP: 
      return { ...state, payload };
    
    case DELETE_TRIP:
      const newState = { ...state };
      delete newState[payload.id];
      return newState
    
    default:
      return state;
  }
}
