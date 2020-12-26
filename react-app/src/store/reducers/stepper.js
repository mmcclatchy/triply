import {
  ADD_SUG,
  ADD_NODE,
  DELETE_NODE,
  UPDATE_STEP,
  SET_PLACE_IMG,
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
      
    case SET_PLACE_IMG:
      const { photoUrl, step, type, index } = payload;
      const newState = { ...state };
      console.log('SET_PLACE_IMG STEP: ', newState.suggestions[step])
      console.log('SET_PLACE_IMG TYPE: ', newState.suggestions[step][type])
      console.log('SET_PLACE_IMG INDEX: ', newState.suggestions[step][type][index])
      newState.suggestions[step][type][index].photoUrl = photoUrl
      console.log('PHOTO URL: ', newState.suggestions[step][type][index].photoUrl)
      return newState

    default:
      return state;
  }
}
