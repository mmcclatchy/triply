export const SET_ORIGIN = 'triply/directions/SET_ORIGIN';
export const SET_DESTINATION = 'triply/directions/SET_DESTINATION'

export const setOriginAction = origin => ({ type: SET_ORIGIN, origin });
export const setDestinationAction = destination => ({type: SET_DESTINATION, destination})
