import { SET_ID } from '../actions/authentication';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case SET_ID: {
      return { ...state, userId: action.userId };
    }
    default:
      return state;
  }
}
