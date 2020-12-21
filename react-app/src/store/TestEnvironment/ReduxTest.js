// ACTIONS
const ADD_TEST_SUG = 'Triply/TestEnvironment/ADD_TEST_SUG';
const ADD_TEST_NODE = 'Triply/TestEnvironment/ADD_TEST_NODE';
const DELETE_TEST_NODE = 'Triply/TestEnvironment/DELETE_TEST_NODE';
const UPDATE_TEST_STEP = 'Triply/TestEnvironment/UPDATE_TEST_STEP';

export const addSuggestion = payload => ({
  type: ADD_TEST_SUG,
  payload
});
export const addNode = payload => ({
  type: ADD_TEST_NODE,
  payload
});
export const deleteNode = placeId => ({ type: DELETE_TEST_NODE, placeId });
export const updateStep = step => ({ type: UPDATE_TEST_STEP, step });

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

// REDUCERS
export default function testenv(
  state = { suggestions: {}, nodes: {}, step: 1 },
  action
) {
  switch (action.type) {
    case ADD_TEST_SUG: {
      const newSuggestions = {
        ...state.suggestions,
        [state.step]: action.payload
      };
      return { ...state, suggestions: newSuggestions };
    }
    case ADD_TEST_NODE: {
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
    case DELETE_TEST_NODE: {
      const array = state.nodes[state.step].filter(
        e => e.place_id !== action.placeId
      );

      const newNodes = {
        ...state.nodes,
        [state.step]: array
      };

      return { ...state, nodes: newNodes };
    }
    case UPDATE_TEST_STEP: {
      state.step = action.step;
      return state;
    }
    default:
      return state;
  }
}
