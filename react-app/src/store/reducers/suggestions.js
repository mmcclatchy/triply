import { SET_SUGGESTIONS } from '../constants/constants';


export default function reducer(state = [], { type, payload }) {
  Object.freeze(state);
  console.log('SUGGESTIONS REDUCER: ', type, payload)
  switch (type) {
    case SET_SUGGESTIONS: 
      return [...state, [payload.suggestions]];
    
    default:
      return state;
  }
}
