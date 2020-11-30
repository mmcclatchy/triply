import { SET_CAR, DELETE_CAR } from '../constants/constants';


// payloads have been normalized in the back end
export default function reducer(state = {}, { type, payload }) {
  Object.freeze(state);
  console.log('REDUCER: TYPE: ', type, '\nPayload: ', payload)
  switch (type) {
    case SET_CAR: 
      return { ...state, payload };
    
    case DELETE_CAR:
      const newState = { ...state };
      delete newState[payload.id];
      return newState
    
    default:
      return state;
  }
}