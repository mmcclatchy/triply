// ACTIONS
const ADD_SUG = 'Triply/Trip/ADD_SUG';
const ADD_NODE = 'Triply/Trip/ADD_NODE';
const EDIT_NODE = 'Triply/Trip/EDIT_NODE';
const DELETE_NODE = 'Triply/Trip/DELETE_NODE';

export const ADD_SUG = payload => ({ type: ADD_SUG, payload });
export const ADD_NODE = payload => ({ type: ADD_NODE, payload });
export const EDIT_NODE = (payload, nodeIndex) => ({
  type: EDIT_NODE,
  payload,
  nodeIndex
});
export const DELETE_NODE = nodeIndex => ({ type: DELETE_NODE, nodeIndex });

// REDUCERS
export default function testenv(
  state = { suggestions: {}, nodes: {} },
  action
) {
  switch (action.type) {
    case ADD_SUG: {
      return { ...state, suggestions: action.payload };
    }
    case ADD_NODE: {
      return { ...state, nodes: action.payload };
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
