import {SET_DURATIONS} from "../constants/constants"

export const setDuration = (payload) =>{
  return{
    type: SET_DURATIONS,
    payload: payload
  }
}