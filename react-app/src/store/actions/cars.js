import { API, SET_CAR, DELETE_CAR } from '../constants/constants';

export const getCars = userId => ({
  type: API,
  method: 'GET',
  endpoint: `/users/${userId}/cars`,
  actionConst: SET_CAR
});

export const getCar = carId => ({
  type: API,
  method: 'GET',
  endpoint: `/cars/${carId}`,
  actionConst: SET_CAR
});

export const postCar = (car, userId) => {
  console.log('POST CAR')
  return {
    type: API,
    payload: {
      method: 'POST',
      endpoint: `/users/${userId}/cars`,
      body: JSON.stringify(car),
      actionConst: SET_CAR
    }
  };
};

export const deleteCar = carId => ({
  type: API,
  payload: {
    method: 'DELETE',
    endpoint: `/cars/${carId}`,
    actionConst: DELETE_CAR
  }
});
