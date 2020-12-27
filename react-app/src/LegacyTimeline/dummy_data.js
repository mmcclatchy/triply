export const trip = {
  id: 1,
  user_id: 1,
  name: "Alycia's Graduation Trip",
  car_id: 1,
  daily_time_limit: 5,
  stop_time_limit: 2,
  toll: true,
  start_time: '2020-12-23 06:30 AM',
  start_location: 'Edison, NJ',
  end_time: '2020-12-23 12:48 PM',
  end_location: 'Ottawa, Ontario, Canada',
  directions: 'some text',
  duration: 7
};

export const car = {
  id: 1,
  user_id: 1,
  api_id: 23904,
  make: 'Honda',
  model: 'Accord',
  year: '2020',
  miles_to_refuel: 350,
  mpg: 30
};

export const stops = [
  {
    id: 1,
    trip_id: 1,
    trip_stop_num: 0,
    coordinates: '23498, 13890',
    time: '2020-12-23 06:30 AM',
    type: 'Origin'
  },
  [
    {
      id: 2,
      trip_id: 1,
      trip_stop_num: 1,
      coordinates: '23498, 13890',
      time: '2020-12-23 08:30 AM',
      type: 'GasStation',
      details: {
        name: 'Shell',
        city: 'Harrisburg',
        img_url:
          'https://assets1.csnews.com/files/styles/content_sm/s3/2018-03/shell-gas-station500x400.jpg?itok=r_plwGa9',
        phone_num: '(403)-293-1939',
        state: 'Pennsylvania',
        street_address: '10 Cherry Lane',
        zip_code: '09921'
      }
    },
    {
      id: 3,
      trip_id: 1,
      trip_stop_num: 1,
      coordinates: '23498, 13890',
      time: '2020-12-23 08:30 AM',
      type: 'Restaurant',
      details: {
        name: 'Chipotle',
        city: 'State College',
        img_url:
          'https://media-cdn.tripadvisor.com/media/photo-s/14/ea/c3/95/outside-and-outdoor-seating.jpg',
        phone_num: '(403)-293-1939',
        state: 'Pennsylvania',
        street_address: '10 Cherry Lane',
        zip_code: '09921'
      }
    }
  ],
  {
    id: 4,
    trip_id: 1,
    trip_stop_num: 2,
    coordinates: '23498, 13890',
    time: '2020-12-23 10:30 AM',
    type: 'Restaurant',
    details: {
      name: 'Chipotle',
      city: 'State College',
      img_url:
        'https://media-cdn.tripadvisor.com/media/photo-s/14/ea/c3/95/outside-and-outdoor-seating.jpg',
      phone_num: '(403)-293-1939',
      state: 'Pennsylvania',
      street_address: '10 Cherry Lane',
      zip_code: '09921'
    }
  },
  [
    {
      id: 5,
      trip_id: 1,
      trip_stop_num: 3,
      coordinates: '23498, 13890',
      time: '2020-12-23 12:30 PM',
      type: 'Restaurant',
      details: {
        name: 'Chipotle',
        city: 'State College',
        img_url:
          'https://media-cdn.tripadvisor.com/media/photo-s/14/ea/c3/95/outside-and-outdoor-seating.jpg',
        phone_num: '(403)-293-1939',
        state: 'Pennsylvania',
        street_address: '10 Cherry Lane',
        zip_code: '09921'
      }
    },
    {
      id: 6,
      trip_id: 1,
      trip_stop_num: 3,
      coordinates: '23498, 13890',
      time: '2020-12-23 12:30 PM',
      type: 'GasStation',
      details: {
        name: 'Shell',
        city: 'Toronto',
        img_url:
          'https://assets1.csnews.com/files/styles/content_sm/s3/2018-03/shell-gas-station500x400.jpg?itok=r_plwGa9',
        phone_num: '(403)-293-1939',
        state: 'Ontario',
        street_address: '10 Cherry Lane',
        zip_code: '09921'
      }
    }
  ],
  [
    {
      id: 7,
      trip_id: 1,
      trip_stop_num: 4,
      coordinates: '23498, 13890',
      time: '2020-12-23 12:48 PM',
      type: 'Hotel',
      details: {
        name: 'Four Seasons',
        city: 'Ottawa',
        img_url:
          'https://m.fourseasons.com/alt/img-opt/~70.1530.0,0000-184,3327-3000,0000-1687,5000/publish/content/dam/fourseasons/images/web/JKR/JKR_083_original.jpg',
        phone_num: '(403)-293-1939',
        state: 'Ontario',
        street_address: '10 Cherry Lane',
        zip_code: '09921'
      }
    },
    {
      id: 8,
      trip_id: 1,
      trip_stop_num: 4,
      coordinates: '23498, 13890',
      time: '2020-12-23 12:48 PM',
      type: 'Destination'
    }
  ]
];
