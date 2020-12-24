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

  const newState = { ...state };
  
  switch (type) {
    case ADD_SUG:
      const newSuggestions = { ...state.suggestions, [state.step]: payload };
      return { ...state, suggestions: newSuggestions };

    case ADD_NODE:   
      const { data, nodeType } = payload;
      
      if (newState.nodes[state.step]) {
        newState.nodes[state.step] = { ...newState.nodes[state.step], [nodeType]: data } 
      }
      else{
        newState.nodes[state.step] = { [nodeType]: data }
      }
      return newState;

    case DELETE_NODE:
      delete newState.nodes[state.step][payload]
      return newState

    case UPDATE_STEP:
      return  { ...state, step: payload };
      
    case SET_PLACE_IMG:
      const { photoUrl, step, type, index } = payload;
      
      newState.suggestions[step][type][index].photoUrl = photoUrl
      return newState

    default:
      return state;
  }
}
