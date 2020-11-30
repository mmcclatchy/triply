import {SET_DURATIONS} from "../constants/constants"

export default function reducer(state = {}, action) {
  Object.freeze(state);
  
  switch (action.type) {
    case SET_DURATIONS: 
      return action.payload;
    
    default:
      return state;
  }
}