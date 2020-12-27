import {
  ADD_SUG,
  ADD_NODE,
  DELETE_NODE,
  UPDATE_STEP,
  SET_PLACE_IMG
} from '../constants/constants';

// pass the suggestions from the backend as the arguments
export const addSuggestion = payload => ({ type: ADD_SUG, payload });

// pass the new node as the argument to be added
export const addNode = payload => ({ type: ADD_NODE, payload });

// pass the placeId of the node that needs to be deleted
export const deleteNode = payload => ({ type: DELETE_NODE, payload });

// pass the number of the step as the argument
export const updateStep = payload => ({ type: UPDATE_STEP, payload });

//------------------------------------------------------------

// Set a selection from suggestions into Redux
export const setNode = data => async dispatch => dispatch(addNode(data));

// Remove a selection from suggestions from Redux
export const unsetNode = id => async dispatch => dispatch(deleteNode(id));

// Fetch a Google Places Photo using the photo_reference
// Place in Redux within the places data
export const fetchImg = (place, step, type, index) => async dispatch => {
  if (!place || !type) return;
  const key = process.env.REACT_APP_GOOGLE_KEY;
  let photoUrl;
  if (place.photos) {
    const reference = place.photos[0].photo_reference;
    photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=80&photoreference=${reference}&key=${key}`;
    dispatch({
      type: SET_PLACE_IMG,
      payload: { photoUrl, step, type, index }
    });
  }
};
