import { SET_TRIP, DELETE_TRIP, CLEAR_TRIPS } from '../constants/constants';

const initialState = {tripId: 0, payload: {},trips: {}};

// payloads have been normalized in the back end
export default function reducer(state = initialState, { type, payload }) {
  Object.freeze(state);
  switch (type) {
    case SET_TRIP:
      console.log('TRIP REDUCER: ', type, payload)
      return { ...state, ...payload };

    case DELETE_TRIP:
      const newState = { ...state };
      delete newState[payload.id];
      return newState

    case CLEAR_TRIPS:
      return initialState;
      
    default:
      return state;
  }
}
