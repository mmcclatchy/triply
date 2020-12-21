import {
  ADD_SUG,
  ADD_NODE,
  DELETE_NODE,
  UPDATE_STEP
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


export const unsetNode = id => async dispatch => dispatch(deleteNode(id));