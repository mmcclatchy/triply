import { API, SET_STOP, DELETE_STOP } from '../constants/constants';


export const getStops = tripId => ({
  type: API,
  payload: {
    method: 'GET',
    endpoint: `/trips/${tripId}/stops`,
    actionConst: SET_STOP
  }
})


export const getStop = stopId => ({
  type: API,
  payload: {
    method: 'GET',
    endpoint: `/stops/${stopId}`,
    actionConst: SET_STOP
  }
})


export const postStop = (stop, tripId) => {
  return {
    type: API,
    payload: {
      method: 'POST',
      endpoint: `/trips/${tripId}/stops`,
      body: JSON.stringify(stop),
      actionConst: SET_STOP
    },
  }
};


export const putStop = (stop, stopId) => ({
  type: API,
  payload: {
    method: 'PUT',
    endpoint: `/stops/${stopId}`,
    body: JSON.stringify(stop),
    actionConst: SET_STOP
  }
})


export const deleteStop = stopId => ({
  type: API,
  payload: {
    method: 'DELETE',
    endpoint: `/stops/${stopId}`,
    actionConst: DELETE_STOP
  }
})