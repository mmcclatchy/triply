import { SET_DESTINATION, SET_ORIGIN, SET_START_TIME,  SET_TRIP_DISTANCE, SET_TRIP_DURATION, SET_DIRECTIONS, CLEAR_DIRECTIONS } from '../constants/constants';


const initialState = {
  startTime: '',
  origin: '',
  destination: '', 
  duration: '',
  distance: '',
  itinerary: {},
  foodQuery: [],
}

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case SET_ORIGIN: 
      return { ...state, origin: payload };
    
    case SET_DESTINATION: 
      return {...state, destination: payload }
    
    case SET_START_TIME: 
      return {...state, startTime: payload }
    
    case SET_TRIP_DISTANCE: 
      return {...state, distance: payload }
    
    case SET_TRIP_DURATION: 
      return {...state, duration: payload }
    
    case SET_DIRECTIONS:
      const { itinerary, foodQuery } = payload;
      return { ...state, itinerary, foodQuery }
      
    case CLEAR_DIRECTIONS:
      return initialState;
      
    default:
      return state;
  }
}
