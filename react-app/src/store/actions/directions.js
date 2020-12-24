export const SET_ORIGIN = 'triply/directions/SET_ORIGIN';
export const SET_DESTINATION = 'triply/directions/SET_DESTINATION';
export const SET_START_TIME = 'triply/directions/SET_START_TIME';
export const SET_TRIP_DURATION = 'triply/directions/SET_TRIP_DURATION';
export const SET_TRIP_DISTANCE = 'triply/directions/SET_TRIP_DISTANCE';


export const setOriginAction = payload => ({ type: SET_ORIGIN, payload });
export const setDestinationAction = payload => ({ type: SET_DESTINATION, payload });
export const setStartTimeAction = payload => ({ type: SET_START_TIME, payload });
export const setDistanceAction = payload => ({ type: SET_TRIP_DISTANCE, payload });
export const setDurationAction = payload => ({ type: SET_TRIP_DURATION, payload})
