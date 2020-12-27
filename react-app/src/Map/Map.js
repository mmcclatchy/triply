/* global google */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  DirectionsRenderer
} from 'react-google-maps';
import {
  setDurationAction,
  setDistanceAction
} from '../store/actions/directions';
//  use withScriptjs and withGoogleMap to wrap the map in order to get the map to load correctly

const InitMap = ({}) => {
  // *** Redux ***
  const reduxStartTime = useSelector(state => state.directions.startTime);
  const reduxOrigin = useSelector(state => state.directions.origin);
  const reduxDestination = useSelector(
    state => state.directions.destination
  );
  const waypoints = useSelector(
    state => state.directions.itinerary?.geocoded_waypoints
  );
  const dispatch = useDispatch();

  
  // *** Local State ***
  const [directions, setDirections] = useState(false);

  
  // *** DOM ***
  // const originField = document.getElementById('origin');
  // const destinationField = document.getElementById('destination');

  
  // *** Google Maps ***
  const directionsService = new google.maps.DirectionsService();
  // const autoOrigin = new google.maps.places.Autocomplete(originField);
  // const autoOrigin2 = new google.maps.places.Autocomplete(destinationField);

  
  // *** Use Effect Hooks ***
  useEffect(() => {
    if (!reduxOrigin && !reduxDestination) {
      return;
    }
    const setRoute = () => {
      directionsService.route(
        {
          origin: {
            query: reduxOrigin
          },
          destination: {
            query: reduxDestination
          },
          waypoints: [
            {
              location: 'Baltimore, MD',
              stopover: true
            },
            {
              location: 'Washington D.C.',
              stopover: true
            }
          ],
          drivingOptions: {
            departureTime: new Date(reduxStartTime)
          },
          travelMode: google.maps.TravelMode.DRIVING
        },
        (response, status) => {
          if (status === 'OK') {
            setDirections(response);
            dispatch(
              setDurationAction(response.routes[0].legs[0].duration.text)
            );
            dispatch(
              setDistanceAction(response.routes[0].legs[0].distance.text)
            );
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        }
      );
    };
    setRoute();
  }, [reduxOrigin, reduxDestination, dispatch]);

  return (
    <>
      <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat: 40.99136, lng: -72.534203 }}>
        {directions ? <DirectionsRenderer directions={directions} /> : null}
      </GoogleMap>
    </>
  );
};

const WrappedMap = withScriptjs(withGoogleMap(InitMap));

//make sure to create .env.local file with REACT_APP_GOOGLE_KEY ="apikey"
export default function Map() {
  return (
    <div>
      <WrappedMap
        id='map'
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_KEY}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: '100% ' }} />}
        containerElement={
          <div style={{ width: `60vw`, height: '100vh', maxHeight: 'auto' }} />
        }
        mapElement={<div style={{ height: '100% ' }} />}
      />
    </div>
  );
}
