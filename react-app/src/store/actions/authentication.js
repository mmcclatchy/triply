import { SET_ID, SET_NAME } from '../constants/constants';


export const setId = userId => ({ type: SET_ID, userId });
export const setName = name => ({ type: SET_NAME, name });
