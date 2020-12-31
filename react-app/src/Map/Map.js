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


const InitMap = ({}) => {
  // *** Redux ***
  const reduxStartTime = useSelector(state => state.directions.startTime);
  const nodes = useSelector(state => state.stepper.nodes);
  const avoidTolls = useSelector(state => state.directions.avoidTolls);
  const reduxOrigin = useSelector(state => state.directions.origin);
  const reduxDestination = useSelector(
    state => state.directions.destination
  );
  const geocoded = useSelector(
    state => state.directions.itinerary?.geocoded_waypoints
  );
  const dispatch = useDispatch();

  
  // *** Local State ***
  const [directions, setDirections] = useState(false);
  const [waypoints, setWaypoints] = useState([]);

  
  // *** Google Maps ***
  const directionsService = new google.maps.DirectionsService();

  
  // *** Helper Functions ***
  // Return an array of each waypoint from the stepper.nodes slice of state
  const getWaypointsFrom = nodes => {
    const waypoints = []
    
    for (const stop of Object.values(nodes)) {
      for (const waypoint of Object.values(stop)) {
        const { location } = waypoint.geometry;
        waypoints.push({ location, stopover: true });
      }
    }
    setWaypoints(waypoints);
  }
  
  
  // *** Use Effect Hooks ***

  useEffect(() => {
    setWaypoints(getWaypointsFrom(nodes))
    console.log('getWaypointsFrom: ', getWaypointsFrom(nodes))
  }, [geocoded])
  
  // Create a Google Maps request to render the route
  useEffect(() => {
    if (!reduxOrigin && !reduxDestination) {
      return;
    }
    
    const setRoute = () => {
      console.log('WAYPOINTS: ', waypoints)
      directionsService.route(
        {
          origin: {
            query: reduxOrigin
          },
          destination: {
            query: reduxDestination
          },
          optimizeWaypoints: true,
          drivingOptions: {
            departureTime: new Date(reduxStartTime)
          },
          travelMode: google.maps.TravelMode.DRIVING,
          waypoints,  
          avoidTolls,
        },
        (response, status) => {
          if (status === 'OK') {
            console.log('GOOGLE RESPONSE: ', response)
            // Set Duration and Distance of Initial API call, then let the
            // algo handle it from then on
            if (step < 2) {
              dispatch(
                setDurationAction(response.routes[0].legs[0].duration.text)
              );
              dispatch(
                setDistanceAction(response.routes[0].legs[0].distance.text)
              );
            }
            
            setDirections(response);
              
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        }
      );
    };
    setRoute();
     
  }, [reduxOrigin, reduxDestination, waypoints]);

  
  // *** JSX ***
  return (
    <>
      <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat: 40.99136, lng: -72.534203 }}>
        {directions ? <DirectionsRenderer directions={directions} /> : console.log('DIRECTIONS ARE NOT RENDERING')}
      </GoogleMap>
    </>
  );
};

// ------------------------------------------------------------------------

// *** React-Google-Map Components ***
//  use withScriptjs and withGoogleMap to wrap the map in order to get the map to load correctly
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
