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
  const geocoded = useSelector(
    state => state.directions.itinerary?.geocoded_waypoints
  );
  // const nodes = useSelector(state => state.stepper.nodes);
  const routes = useSelector(state => state.directions.itinerary.routes)
  const itinerary = useSelector(state => state.directions.itinerary)
  const dispatch = useDispatch();

  
  // *** Local State ***
  const [directions, setDirections] = useState(false);
  // const [waypoints, setWaypoints] = useState([]);

  
  // *** DOM ***
  // const originField = document.getElementById('origin');
  // const destinationField = document.getElementById('destination');

  
  // *** Google Maps ***
  const directionsService = new google.maps.DirectionsService();
  // const autoOrigin = new google.maps.places.Autocomplete(originField);
  // const autoOrigin2 = new google.maps.places.Autocomplete(destinationField);

  
  // *** Helper Functions ***
  // Create an object of waypoints normalized by place_id
  // const orderWaypointsByPlaceId = nodes => {
  //   const waypointObj = {};
    
  //   for (let key in nodes) {
  //     const stop = nodes[key];
  //     console.log('STOP: ', stop)
  //     const { restaurants: r, gasStations: g, hotels: h } = stop;
        
  //       if (r) waypointObj[r.place_id] = r;
  //       if (g) waypointObj[g.place_id] = g;
  //       if (h) waypointObj[h.place_id] = h;
  //   }
  //   return waypointObj;
  // }
  
  // Takes in geocoded_waypoints and nodes from stepper slice of state
  // Returns data from Google Places Search API in the proper order
  
  // const sortWaypoints = (order, nodes) => {
  //   console.log('SORT WAYPOINTS ORDER: ', order)
  //   console.log('SORT WAYPOINTS NODES: ', nodes)
  //   const waypointObj = orderWaypointsByPlaceId(nodes);
  //   console.log('WAYPOINT OBJ: ', waypointObj)
    
  //   const sortedNodes = [];
  //   for (let i = 1; i < order.length - 1; i++) {
  //     const waypoint = order[i];
  //     console.log('ORDER WAYPOINT PLACE ID: ', waypoint.place_id)
  //     sortedNodes.push(waypointObj[waypoint.place_id]);
  //     console.log('SORTED NODES: ', sortedNodes)
  //   }
    
  //   const sorted = [
  //     { geometry: { location: reduxOrigin }},
  //     ...sortedNodes,
  //     { geometry: { location: reduxDestination }},
  //   ]
  //   console.log("🚀 ~ file: Map.js ~ line 80 ~ sortWaypoints ~ sorted", sorted)
    
  //   return sorted.map(waypoint => {
  //     console.log('MAPPED WAYPOINT: ', waypoint)
  //     console.log('MAPPED WAYPOINT LOCATION: ', waypoint?.location)
  //     return {
  //       location: waypoint?.geometry?.location,
  //       stopover: true,
  //     }
  //   });
  // }
  
  
  // *** Use Effect Hooks ***
  // Order waypoint data based on itinerary geocoded_waypoints order
  // useEffect(() => {
  //   setWaypoints(sortWaypoints(geocoded, nodes))
    
  //   console.log('ITINERARY RERENDER')
  // }, [geocoded])
  
  useEffect(() => {
    if (!reduxOrigin && !reduxDestination) {
      return;
    }
    
    if (geocoded && routes) {
      // const directionsResult = google.maps.DirectionsResult(geocoded, routes)
      // directionsService.setDirections(itinerary);
      console.log('GEOCODED AND ROUTES')
      setDirections(directionsService);
      
    }
    else {
      const setRoute = () => {
        directionsService.route(
          {
            origin: {
              query: reduxOrigin
            },
            destination: {
              query: reduxDestination
            },
            // waypoints: waypoints,  
            // optimizeWaypoints: true,
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
      
    }
    
  }, [reduxOrigin, reduxDestination, geocoded]);

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
