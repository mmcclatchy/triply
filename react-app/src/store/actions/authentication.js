export const SET_ID = 'triply/authentication/SET_ID';
export const SET_NAME = 'triply/authentication/SET_NAME';

export const setId = userId => ({ type: SET_ID, userId });
export const setName = name => ({ type: SET_NAME, name });
