import { SET_ID, SET_NAME } from '../constants/constants';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case SET_ID: {
      return { ...state, userId: action.userId };
    }
    case SET_NAME: {
      return { ...state, userName: action.name };
    }
    default:
      return state;
  }
}
