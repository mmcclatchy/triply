// ACTIONS
const ADD_SUG = 'Triply/Trip/ADD_SUG';
const ADD_NODE = 'Triply/Trip/ADD_NODE';
const EDIT_NODE = 'Triply/Trip/EDIT_NODE';
const DELETE_NODE = 'Triply/Trip/DELETE_NODE';

export const addSuggestion = (payload, stepNum) => ({
  type: ADD_SUG,
  payload,
  stepNum
});
export const addNode = (payload, stepNum) => ({
  type: ADD_NODE,
  payload,
  stepNum
});
export const editNode = (payload, nodeIndex) => ({
  type: EDIT_NODE,
  payload,
  nodeIndex
});
export const deleteNode = nodeIndex => ({ type: DELETE_NODE, nodeIndex });

// "Fetches";
export const setSuggestion = (stepNum, payload) => async dispatch => {
  dispatch(addSuggestion(stepNum, payload));
};

// REDUCERS
export default function testenv(
  state = { suggestions: {}, nodes: {} },
  action
) {
  switch (action.type) {
    case ADD_SUG: {
      state.suggestions[action.stepNum] = action.payload;
      return state;
    }
    case ADD_NODE: {
      state.nodes[action.stepNum] = action.payload;
      return state;
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
    default:
      return state;
  }
}
