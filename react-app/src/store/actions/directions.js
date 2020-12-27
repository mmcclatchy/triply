import {
  SET_ORIGIN,
  SET_DESTINATION,
  SET_START_TIME,
  SET_TRIP_DURATION,
  SET_TRIP_DISTANCE,
  CLEAR_DIRECTIONS
} from '../constants/constants';


export const setOriginAction = payload => ({ type: SET_ORIGIN, payload });
export const setDestinationAction = payload => ({ type: SET_DESTINATION, payload });
export const setStartTimeAction = payload => ({ type: SET_START_TIME, payload });
export const setDistanceAction = payload => ({ type: SET_TRIP_DISTANCE, payload });
export const setDurationAction = payload => ({ type: SET_TRIP_DURATION, payload})
export const clearDirections = () => ({ type: CLEAR_DIRECTIONS })