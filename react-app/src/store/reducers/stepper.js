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
  nodes: {
    1: [
      {
        business_status: 'OPERATIONAL',
        geometry: {
          location: {
            lat: 41.0245888,
            lng: -75.2992745
          },
          viewport: {
            northeast: {
              lat: 41.02587177989272,
              lng: -75.29787722010728
            },
            southwest: {
              lat: 41.02317212010728,
              lng: -75.30057687989273
            }
          }
        },
        icon:
          'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
        name: 'Forge Of Taste',
        opening_hours: {
          open_now: false
        },
        photos: [
          {
            height: 2268,
            html_attributions: [
              '<a href="https://maps.google.com/maps/contrib/111621241898391383195">Kamil</a>'
            ],
            photo_reference:
              'ATtYBwKfMohTYHyUYptYToO8l0rI9-dEbTsaMWeJLHXAoMuyAWyeHJqBnwKe0nI8Rc4rPxgFEzaK7cgBF59BqatLtztVKU3mZI-OmMU4csonmMbpvVujw6KQ5DcucMtEofzFTXDLs50wbVkjgaBLrxFKn6RTeHbtmhuf3oz7c8IAFB1qHiT7',
            width: 4032
          }
        ],
        place_id: 'ChIJW3-EwwiLxIkR0PztDhg1MXg',
        plus_code: {
          compound_code: '2PF2+R7 Tannersville, Pennsylvania',
          global_code: '87H62PF2+R7'
        },
        rating: 4.8,
        reference: 'ChIJW3-EwwiLxIkR0PztDhg1MXg',
        scope: 'GOOGLE',
        types: ['restaurant', 'food', 'point_of_interest', 'establishment'],
        user_ratings_total: 107,
        vicinity: '254 Stadden Rd, Tannersville',
        photoUrl:
          'https://maps.googleapis.com/maps/api/place/photo?maxwidth=250&photoreference=ATtYBwKfMohTYHyUYptYToO8l0rI9-dEbTsaMWeJLHXAoMuyAWyeHJqBnwKe0nI8Rc4rPxgFEzaK7cgBF59BqatLtztVKU3mZI-OmMU4csonmMbpvVujw6KQ5DcucMtEofzFTXDLs50wbVkjgaBLrxFKn6RTeHbtmhuf3oz7c8IAFB1qHiT7&key=AIzaSyBmKKKPntFx-1yFUAIgXjWQU3wykVlBt3Y',
        type: 'restaurants'
      }
    ]
  },
  step: 1
};

export default function stepperReducer(state = initState, action) {
  Object.freeze(state);

  let displayedSuggestions;
  // console.log("stepper reducer", type, payload)
  console.log(ADD_SUG, 'add sug');
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
