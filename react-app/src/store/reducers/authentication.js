import { SET_AUTH, SET_ID, SET_NAME } from '../constants/constants';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case SET_ID: {
      return { ...state, userId: action.userId };
    }
    case SET_NAME: {
      return { ...state, userName: action.name };
    }
    case SET_AUTH: {
      return { ...state, auth: action.auth };
    }
    default:
      return state;
  }
}
