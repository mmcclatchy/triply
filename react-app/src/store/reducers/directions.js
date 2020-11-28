import { SET_DESTINATION, SET_ORIGIN, SET_START_TIME} from '../actions/directions';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case SET_ORIGIN: {
      return { ...state, origin: action.origin };
    }
    case SET_DESTINATION: {
      return{...state, destination: action.destination}
    }
    case SET_START_TIME: {
      return{...state, startTime: action.startTime}
    }
    default:
      return state;
  }
}
