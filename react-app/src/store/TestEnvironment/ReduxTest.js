// ACTIONS
const ADD_SUG = 'Triply/Trip/ADD_SUG';

const ADD_NODE = 'Triply/Trip/ADD_NODE';
const DELETE_NODE = 'Triply/Trip/DELETE_NODE';

const UPDATE_STEP = 'Triply/Trip/UPDATE_STEP';

const UPDATE_ORIGIN_NODE = 'Triply/Trip/UPDATE_ORIGIN_NODE';
const UPDATE_DEST_NODE = 'Triply/Trip/UPDATE_DEST_NODE';

export const addSuggestion = payload => ({
  type: ADD_SUG,
  payload
});
export const addNode = payload => ({
  type: ADD_NODE,
  payload
});
export const deleteNode = placeId => ({ type: DELETE_NODE, placeId });
export const updateStep = step => ({ type: UPDATE_STEP, step });
export const updateOrigin = payload => ({ type: UPDATE_ORIGIN_NODE, payload });
export const updateDest = payload => ({ type: UPDATE_DEST_NODE, payload });

// "Fetches";
export const setSuggestion = payload => async dispatch => {
  // fetch to algorithm will go here;
  dispatch(addSuggestion(payload));
};

export const setNode = payload => async dispatch => {
  // fetch to algorithm will go here;
  dispatch(addNode(payload));
};

export const unsetNode = id => async dispatch => {
  dispatch(deleteNode(id));
};

export const OriginDestination = (origin, dest) => async dispatch => {
  dispatch(updateOrigin(origin));
  dispatch(updateDest(dest));
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
      const array = state.nodes[state.step];
      let data = action.payload;

      if (!array) {
        data = [action.payload];
      } else {
        data = [...array, action.payload];
      }
      const newNodes = {
        ...state.nodes,
        [state.step]: data
      };
      return { ...state, nodes: newNodes };
    }
    case DELETE_NODE: {
      const array = state.nodes[state.step].filter(
        e => e.place_id !== action.placeId
      );

      const newNodes = {
        ...state.nodes,
        [state.step]: array
      };

      return { ...state, nodes: newNodes };
    }
    case UPDATE_STEP: {
      state.step = action.step;
      return state;
    }
    default:
      return state;
  }
}
