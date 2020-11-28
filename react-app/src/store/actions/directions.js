export const SET_ORIGIN = 'triply/directions/SET_ORIGIN';
export const SET_DESTINATION = 'triply/directions/SET_DESTINATION';
export const SET_START_TIME = 'triply/directions/SET_START_TIME';


export const setOriginAction = origin => ({ type: SET_ORIGIN, origin });
export const setDestinationAction = destination => ({ type: SET_DESTINATION, destination })
export const setStartTimeAction = startTime => ({type: SET_START_TIME, startTime})
