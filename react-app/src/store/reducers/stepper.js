import {
  ADD_SUG,
  ADD_NODE,
  DELETE_NODE,
  UPDATE_STEP,
  SET_PLACE_IMG,
  CLEAR_STEPPER,
  TRIP_COMPLETE,
  SET_DISPLAYED_SUGGESTIONS,
  CLEAR_DISPLAYED_SUGGESTIONS
} from '../constants/constants';

const initState = {
  suggestions: {},
  nodes: {},
  step: 1
};

export default function stepperReducer(state = initState, action) {
  Object.freeze(state);

  let displayedSuggestions;
  // console.log("stepper reducer", type, payload)
  // console.log(ADD_SUG, 'add sug');
  switch (action.type) {
    case ADD_SUG:
      // console.log("this is state.step", state.step)
      // console.log(state.suggestions, "this is state.suggestions")
      // console.log("payload", payload)
      const newSuggestions = {
        ...state.suggestions,
        [state.step]: action.payload
      };
      console.log('STEPPER: ADD_SUG: ', newSuggestions);
      return { ...state, suggestions: newSuggestions };

    case ADD_NODE:
      const array = state.nodes[state.step];

      const data = array ? [...array, action.payload] : [action.payload];

      const newNode = { ...state.nodes, [state.step]: data };
      return { ...state, nodes: newNode };

    case UPDATE_STEP:
      return { ...state, step: action.payload };

    case DELETE_NODE:
      const deleteArray = state.nodes[state.step].filter(
        e => e.place_id !== action.payload
      );

      const newNodes = {
        ...state.nodes,
        [state.step]: deleteArray
      };

      return { ...state, nodes: newNodes };

    case TRIP_COMPLETE:
      return { ...state, tripComplete: action.payload };

    case CLEAR_STEPPER:
      return initState;

    case SET_PLACE_IMG:
      const newState = { ...state };
      const { photoUrl, step, type, index } = action.payload;
      // console.log('SET_PLACE_IMG: ', payload);

      newState.suggestions[step][type][index].photoUrl = photoUrl;
      return newState;

    case SET_DISPLAYED_SUGGESTIONS:
      displayedSuggestions = {
        ...state.displayedSuggestions,
        ...action.payload
      };
      return { ...state, displayedSuggestions };

    case CLEAR_DISPLAYED_SUGGESTIONS:
      displayedSuggestions = {};
      return { ...state, displayedSuggestions };

    default:
      return state;
  }
}
