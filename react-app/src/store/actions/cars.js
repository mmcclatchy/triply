import { API, SET_CAR, DELETE_CAR } from '../constants/constants';


export const getCars = userId => ({
  type: API,
  method: 'GET',
  endpoint: `/users/${userId}/cars`,
  actionConst: SET_CAR
})


export const getCar = tripId => ({
  type: API,
  method: 'GET',
  endpoint: `/cars/${tripId}`,
  actionConst: SET_CAR
})


export const postCar = (trip, userId) => ({
  type: API,
  payload: {
    method: 'POST',
    endpoint: `/users/${userId}/cars`,
    body: JSON.stringify(trip),
    actionConst: SET_CAR
  },
});


export const deleteCar = tripId => ({
  type: API,
  payload: {
    method: 'DELETE',
    endpoint: `/cars/${tripId}`,
    actionConst: DELETE_CAR
  }
})