import { SET_ID, SET_NAME, SET_AUTH } from '../constants/constants';

export const setId = userId => ({ type: SET_ID, userId });
export const setName = name => ({ type: SET_NAME, name });
export const setAuth = auth => ({ type: SET_AUTH, auth });
