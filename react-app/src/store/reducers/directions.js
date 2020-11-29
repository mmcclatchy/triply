import { SET_DESTINATION, SET_ORIGIN, SET_START_TIME,  SET_TRIP_DISTANCE, SET_TRIP_DURATION} from '../actions/directions';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case SET_ORIGIN: {
      return { ...state, origin: action.origin };
    }
    case SET_DESTINATION: {
      return {...state, destination: action.destination}
    }
    case SET_START_TIME: {
      return {...state, startTime: action.startTime}
    }
    case SET_TRIP_DISTANCE: {
      return {...state, distance: action.distance}
    }
    case SET_TRIP_DURATION: {
      return {...state, duration: action.duration}
    }
    default:
      return state;
  }
}
