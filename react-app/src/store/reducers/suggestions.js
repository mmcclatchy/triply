import { SET_SUGGESTIONS } from '../constants/constants';


export default function reducer(state = [], { type, payload }) {
  Object.freeze(state);
  console.log('SUGGESTIONS REDUCER: ', type, payload)
  switch (type) {
    case SET_SUGGESTIONS: 
      return [
        {
          coordinates: '23498, 13890',
          time: '2020-12-23 06:30 AM',
          suggestions: {
            Hotel: [
              {
                name: 'Four Seasons',
                place_id: 238490,
                type: 'Hotel',
                city: 'Ottawa',
                img_url:
                  'https://m.fourseasons.com/alt/img-opt/~70.1530.0,0000-184,3327-3000,0000-1687,5000/publish/content/dam/fourseasons/images/web/JKR/JKR_083_original.jpg',
                phone_num: '(403)-293-1939',
                state: 'Ontario',
                street_address: '10 Cherry Lane',
                zip_code: '09921'
              },
              {
                name: 'Roadside Motel',
                place_id: 238490,
                type: 'Hotel',
                city: 'Ottawa',
                img_url:
                  'https://m.fourseasons.com/alt/img-opt/~70.1530.0,0000-184,3327-3000,0000-1687,5000/publish/content/dam/fourseasons/images/web/JKR/JKR_083_original.jpg',
                phone_num: '(403)-293-1939',
                state: 'Ontario',
                street_address: '10 Cherry Lane',
                zip_code: '09921'
              }
            ],
            Restaurant: [
              {
                name: 'Chipotle',
                place_id: 238490,
                type: 'Restaurant',
                city: 'State College',
                img_url:
                  'https://media-cdn.tripadvisor.com/media/photo-s/14/ea/c3/95/outside-and-outdoor-seating.jpg',
                phone_num: '(403)-293-1939',
                state: 'Pennsylvania',
                street_address: '10 Cherry Lane',
                zip_code: '09921'
              }
            ],
            Gas: [
              {
                name: 'Shell',
                place_id: 238490,
                type: 'GasStation',
                city: 'Toronto',
                img_url:
                  'https://assets1.csnews.com/files/styles/content_sm/s3/2018-03/shell-gas-station500x400.jpg?itok=r_plwGa9',
                phone_num: '(403)-293-1939',
                state: 'Ontario',
                street_address: '10 Cherry Lane',
                zip_code: '09921'
              }
            ]
          }
        },
        {
          coordinates: '23498, 13890',
          time: '2020-12-23 04:30 PM',
          suggestions: {
            Hotel: [
              {
                name: 'Four Seasons2',
                place_id: 238490,
                type: 'Hotel',
                city: 'Ottawa',
                img_url:
                  'https://m.fourseasons.com/alt/img-opt/~70.1530.0,0000-184,3327-3000,0000-1687,5000/publish/content/dam/fourseasons/images/web/JKR/JKR_083_original.jpg',
                phone_num: '(403)-293-1939',
                state: 'Ontario',
                street_address: '10 Cherry Lane',
                zip_code: '09921'
              }
            ],
            Restaurant: [
              {
                name: 'Chipotle',
                place_id: 238490,
                type: 'Restaurant',
                city: 'State College',
                img_url:
                  'https://media-cdn.tripadvisor.com/media/photo-s/14/ea/c3/95/outside-and-outdoor-seating.jpg',
                phone_num: '(403)-293-1939',
                state: 'Pennsylvania',
                street_address: '10 Cherry Lane',
                zip_code: '09921'
              }
            ],
            Gas: [
              {
                name: 'Shell',
                place_id: 238490,
                type: 'GasStation',
                city: 'Toronto',
                img_url:
                  'https://assets1.csnews.com/files/styles/content_sm/s3/2018-03/shell-gas-station500x400.jpg?itok=r_plwGa9',
                phone_num: '(403)-293-1939',
                state: 'Ontario',
                street_address: '10 Cherry Lane',
                zip_code: '09921'
              }
            ]
          }
        },
        {
          coordinates: '23498, 13890',
          time: '2020-12-23 06:30 AM',
          suggestions: {
            Hotel: [
              {
                name: 'Four Seasons',
                place_id: 238490,
                type: 'Hotel',
                city: 'Ottawa',
                img_url:
                  'https://m.fourseasons.com/alt/img-opt/~70.1530.0,0000-184,3327-3000,0000-1687,5000/publish/content/dam/fourseasons/images/web/JKR/JKR_083_original.jpg',
                phone_num: '(403)-293-1939',
                state: 'Ontario',
                street_address: '10 Cherry Lane',
                zip_code: '09921'
              }
            ],
            Restaurant: [
              {
                name: 'Chipotle',
                place_id: 238490,
                type: 'Restaurant',
                city: 'State College',
                img_url:
                  'https://media-cdn.tripadvisor.com/media/photo-s/14/ea/c3/95/outside-and-outdoor-seating.jpg',
                phone_num: '(403)-293-1939',
                state: 'Pennsylvania',
                street_address: '10 Cherry Lane',
                zip_code: '09921'
              }
            ],
            Gas: [
              {
                name: 'Shell',
                place_id: 238490,
                type: 'GasStation',
                city: 'Toronto',
                img_url:
                  'https://assets1.csnews.com/files/styles/content_sm/s3/2018-03/shell-gas-station500x400.jpg?itok=r_plwGa9',
                phone_num: '(403)-293-1939',
                state: 'Ontario',
                street_address: '10 Cherry Lane',
                zip_code: '09921'
              }
            ]
          }
        },
        {
          coordinates: '23498, 13890',
          time: '2020-12-23 06:30 AM',
          suggestions: {
            Hotel: [
              {
                name: 'Four Seasons',
                place_id: 238490,
                type: 'Hotel',
                city: 'Ottawa',
                img_url:
                  'https://m.fourseasons.com/alt/img-opt/~70.1530.0,0000-184,3327-3000,0000-1687,5000/publish/content/dam/fourseasons/images/web/JKR/JKR_083_original.jpg',
                phone_num: '(403)-293-1939',
                state: 'Ontario',
                street_address: '10 Cherry Lane',
                zip_code: '09921'
              }
            ],
            Restaurant: [
              {
                name: 'Chipotle',
                place_id: 238490,
                type: 'Restaurant',
                city: 'State College',
                img_url:
                  'https://media-cdn.tripadvisor.com/media/photo-s/14/ea/c3/95/outside-and-outdoor-seating.jpg',
                phone_num: '(403)-293-1939',
                state: 'Pennsylvania',
                street_address: '10 Cherry Lane',
                zip_code: '09921'
              }
            ],
            Gas: [
              {
                name: 'Shell',
                place_id: 238490,
                type: 'GasStation',
                city: 'Toronto',
                img_url:
                  'https://assets1.csnews.com/files/styles/content_sm/s3/2018-03/shell-gas-station500x400.jpg?itok=r_plwGa9',
                phone_num: '(403)-293-1939',
                state: 'Ontario',
                street_address: '10 Cherry Lane',
                zip_code: '09921'
              }
            ]
          }
        }
      ];
    
    default:
      return state;
  }
}
