import { SET_DESTINATION, SET_ORIGIN} from '../actions/directions';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case SET_ORIGIN: {
      return { ...state, origin: action.origin };
    }
    case SET_DESTINATION: {
      return{...state, destination: action.destination}
    }
    default:
      return state;
  }
}
