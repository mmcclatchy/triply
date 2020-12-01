import { SET_SUGGESTIONS } from '../constants/constants';


export default function reducer(state = {}, { type, payload }) {
  Object.freeze(state);
  
  switch (type) {
    case SET_SUGGESTIONS: 
      return { ...state, payload };
    
    default:
      return state;
  }
}
