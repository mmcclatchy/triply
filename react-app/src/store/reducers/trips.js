import { SET_TRIP, DELETE_TRIP } from '../constants/constants';


// payloads have been normalized in the back end
export default function reducer(state = {tripId: 0, payload: {},trips: {}}, { type, payload }) {
  Object.freeze(state);
  console.log('TRIP REDUCER: ', type, payload)
  switch (type) {
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
