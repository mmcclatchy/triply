import {
  ADD_SUG,
  ADD_NODE,
  DELETE_NODE,
  UPDATE_STEP
} from '../constants/constants';

const initState = {
  suggestions: {},
  nodes: {},
  step: 1
};

export default function stepperReducer(state = initState, { type, payload }) {
  Object.freeze(state);

  switch (type) {
    case ADD_SUG:
      const newSuggestions = { ...state.suggestions, [state.step]: payload };
      return { ...state, suggestions: newSuggestions };

    case ADD_NODE:
      const array = state.nodes[state.step];
      const data = array ? [...array, payload] : [payload];
      const newNodes = { ...state.nodes, [state.step]: data };
      return { ...state, nodes: newNodes };

    case DELETE_NODE:
      const nodes = state.nodes[state.step].filter(
        node => node.placeId !== payload
      );
      return { ...state, nodes: { ...state.nodes, [state.step]: nodes } };

    case UPDATE_STEP:
      return  { ...state, step: payload };

    default:
      return state;
  }
}
