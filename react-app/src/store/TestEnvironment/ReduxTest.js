// ACTIONS
const ADD_SUG = 'Triply/Trip/ADD_SUG';
const ADD_NODE = 'Triply/Trip/ADD_NODE';
const EDIT_NODE = 'Triply/Trip/EDIT_NODE';
const DELETE_NODE = 'Triply/Trip/DELETE_NODE';
const GET_STEP = 'Triply/Trip/GET_STEP';
const UPDATE_STEP = 'Triply/Trip/UPDATE_STEP';

export const addSuggestion = payload => ({
  type: ADD_SUG,
  payload
});
export const addNode = payload => ({
  type: ADD_NODE,
  payload
});
export const editNode = (payload, nodeIndex) => ({
  type: EDIT_NODE,
  payload,
  nodeIndex
});
export const deleteNode = nodeIndex => ({ type: DELETE_NODE, nodeIndex });
export const getStep = () => ({ type: GET_STEP });
export const updateStep = step => ({ type: UPDATE_STEP, step });

// "Fetches";
export const setSuggestion = payload => async dispatch => {
  // fetch to algorithm will go here;
  dispatch(addSuggestion(payload));
};

export const setNode = payload => async dispatch => {
  // fetch to algorithm will go here;
  dispatch(addNode(payload));
};

// REDUCERS
export default function testenv(
  state = { suggestions: {}, nodes: {}, step: 1 },
  action
) {
  switch (action.type) {
    case ADD_SUG: {
      const newSuggestions = {
        ...state.suggestions,
        [state.step]: action.payload
      };
      return { ...state, suggestions: newSuggestions };
    }
    case ADD_NODE: {
      const newNodes = {
        ...state.nodes,
        [state.step]: action.payload
      };
      return { ...state, nodes: newNodes };
    }
    case EDIT_NODE: {
      const newState = state.nodes;
      newState[action.nodeIndex] = action.payload;
      return newState;
    }
    case DELETE_NODE: {
      const newState = state.nodes;
      newState[action.nodeIndex] = null;
      return newState;
    }
    case GET_STEP: {
      return state.step;
    }
    case UPDATE_STEP: {
      state.step = action.step;
      return state;
    }
    default:
      return state;
  }
}
