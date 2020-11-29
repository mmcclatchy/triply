import { SHOW_FORM, HIDE_FORM } from '../constants/constants';

export default function reducer(state = { formVisible: false }, action) {
  switch (action.type) {
    case SHOW_FORM: {
      return { ...state, formVisible: true };
    }
    case HIDE_FORM: {
      return { ...state, formVisible: false };
    }
    default:
      return state;
  }
}
