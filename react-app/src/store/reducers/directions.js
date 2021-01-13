import { SET_DESTINATION, SET_ORIGIN, SET_START_TIME,  SET_TRIP_DISTANCE, SET_TRIP_DURATION, SET_DIRECTIONS, CLEAR_DIRECTIONS, SET_AVOID_TOLLS } from '../constants/constants';


const initialState = {
  startTime: '',
  origin: '',
  destination: '', 
  duration: '',
  distance: '',
  itinerary: {},
  foodQuery: [],
  avoidTolls: false,
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
      // const { itinerary, foodQuery, tripUrl } = payload;
      // console.log('DIRECTION STATE: ', state)
      // const newState = { ...state, itinerary, foodQuery, tripUrl }
      // console.log("🚀 ~ file: directions.js ~ line 36 ~ reducer ~ newState", newState)
      console.log('SET_DIRECTIONS: ', payload)
      return { ...state, ...payload }
      
    case CLEAR_DIRECTIONS:
      return initialState;
    
    case SET_AVOID_TOLLS:
      return { ...state, avoidTolls: payload };
      
    default:
      return state;
  }
}
