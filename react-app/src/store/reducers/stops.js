import { SET_STOP } from '../actions/utilities';


// payloads have been normalized in the back end
export default function reducer(state, { payload }) {
  Object.freeze(state);
  
  switch (action.type) {
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