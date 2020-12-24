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
      // console.log('payload: ', payload)
      console.log('data: ', payload.data)
      console.log('nodeType: ', payload.nodeType)
      console.log('nodes: ', newState.nodes)
      console.log('step: ', state.step)
  
      
      const { data, nodeType } = payload;
      
      if (newState.nodes[state.step]) {
        newState.nodes[state.step] = { ...newState.nodes[state.step], [nodeType]: data } 
      }
      else{
        newState.nodes[state.step] = { [nodeType]: data }
      }
      return newState;
      
      // const array = state.nodes[state.step[payload.nodeType]];
      // const data = array ? [...array, payload.data] : [payload.data];
      // const newNodes = { ...state.nodes, [state.step]: { [payload.nodeType]: data }};
      // return { ...state, nodes: newNodes };

    case DELETE_NODE:
      delete newState.nodes[state.step][payload]
      return newState
    
      // const nodes = state.nodes[state.step].filter(
      //   node => node.placeId !== payload
      // );
      // return { ...state, nodes: { ...state.nodes, [state.step]: nodes } };

    case UPDATE_STEP:
      return  { ...state, step: payload };
      
    case SET_PLACE_IMG:
      const { photoUrl, step, type, index } = payload;
      // const newState = { ...state };
      newState.suggestions[step][type][index].photoUrl = photoUrl
      return newState

    default:
      return state;
  }
}
