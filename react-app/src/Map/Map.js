/* global google */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  DirectionsRenderer,
  InfoWindow
} from 'react-google-maps';
import {
  setDurationAction,
  setDistanceAction
} from '../store/actions/directions';
import './Map.css';
import foodIcon from '../assets/restaurant.svg';
import gasIcon from '../assets/GasStation.svg';
import hotelIcon from '../assets/hotel.svg';


const InitMap = ({}) => {
  // *** Redux ***
  const reduxStartTime = useSelector(state => state.directions.startTime);
  const nodes = useSelector(state => state.stepper.nodes);
  const avoidTolls = useSelector(state => state.directions.avoidTolls);
  const reduxOrigin = useSelector(state => state.directions.origin);
  const step = useSelector(state => state.stepper.step);
  const reduxDestination = useSelector(state => state.directions.destination);
  const itinerary = useSelector(state => state.directions.itinerary)
  const dispatch = useDispatch();
  const suggestions = useSelector(state => state.stepper.suggestions);
  const tripComplete = useSelector(state => state.stepper.tripComplete);
  
  
  // *** Local State ***
  const [directions, setDirections] = useState(false);
  const [waypoints, setWaypoints] = useState([]);
  const [restaurants, setRestaurants] = useState("")
  const [gasStations, setGasStations] = useState("")
  const [hotels, setHotels] = useState("")
  const [center, setCenter] = useState({ lat: 40.99136, lng: -72.534203 });
  const [zoom, setZoom] = useState(10);


  // *** Google Maps ***
  const directionsService = new google.maps.DirectionsService();
  

  // *** Helper Functions ***
  // Return an array of each waypoint from the stepper.nodes slice of state
  const getWaypointsFrom = nodes => {
    const waypointsArr = []
    
    for (const stop of Object.values(nodes)) {
      for (const waypoint of Object.values(stop)) {
        const { location } = waypoint.geometry;
        waypointsArr.push({ location, stopover: true });
      }
    }
    console.log(waypointsArr)
    setWaypoints(waypointsArr);
  }

  
  // *** Use Effect Hooks ***

  useEffect(() => {
    setWaypoints(getWaypointsFrom(nodes))
    console.log('getWaypointsFrom: ', getWaypointsFrom(nodes))
  }, [itinerary])
  

  useEffect(() => {
    if (tripComplete) {
      setZoom(10)
      setCenter()
      setRestaurants("")
      setGasStations("")
      setHotels("")
      const matches = document.querySelectorAll("div.gm-style-iw, div.gm-style-iw-c, div.gm-style-iw-t")
      for (let i = 0; i < matches.length; i++){
        matches[i].classList.add("invisible")
      }
    }
  }, [tripComplete])
  
  // Adding suggestion info windows to the map
  useEffect(() => {
    const stopNums = Object.keys(suggestions)
    const currentSuggestions = suggestions[stopNums[stopNums.length - 1]]
    
    if (suggestions[1]) {
      const restaurantSuggestions = []
      let i = 0
      while (i < 3 && currentSuggestions.restaurants[i]) {
        restaurantSuggestions.push(currentSuggestions.restaurants[i])
        i++
      }
      setRestaurants(
        restaurantSuggestions
      )

      const gasStationSuggestions = []
      let j = 0
      while (j < 3 && currentSuggestions.gasStations[j]) {
        gasStationSuggestions.push(currentSuggestions.gasStations[j])
        j++
      }
      setGasStations(
        gasStationSuggestions
      )

      const hotelSuggestions = []
      let k = 0
      while (k < 3 && currentSuggestions.hotels[k]) {
        hotelSuggestions.push(currentSuggestions.hotels[k])
        k++
      }
      setHotels(
        hotelSuggestions
      )

      const matches = document.querySelectorAll("div.gm-style-iw, div.gm-style-iw-c, div.gm-style-iw-t")
      for (let i = 0; i < matches.length; i++){
        matches[i].classList.add("invisible")
      }
      setCenter(currentSuggestions.centerOfSearch)
      setZoom(14)
    }
  }, [suggestions])

  // Create a Google Maps request to render the route
  useEffect(() => {
    if (!reduxOrigin && !reduxDestination) {
      return;
    }

    const setRoute = () => {
      // console.log('WAYPOINTS: ', waypoints)
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
            // console.log('GOOGLE RESPONSE: ', response)
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
    console.log('RENDER MAP')
  }, [reduxOrigin, reduxDestination, waypoints]);


  // *** JSX ***
  return (
    <>
      {
        !restaurants 
          ? <GoogleMap
              zoom={12}
              id={"newMap"}
              center={center}>
              {directions ? <DirectionsRenderer directions={directions} /> : null}
            </GoogleMap> 
          : <GoogleMap
              id="newMap"
              zoom={zoom}
              center={center}
            >
              {
                restaurants[0] && restaurants.map(suggestion => {
                  return (
                    <InfoWindow
                      key={suggestion.place_id}
                      zIndex={10}
                      position={{ lat: suggestion.geometry.location.lat, lng: suggestion.geometry.location.lng }}
                    >
                      <div style={{display: "flex", justifyContent:"center", alignItems:"center"}}>
                        <img src={foodIcon} style={{ width: "3em", margin: "1em" }}/>
                        <h3>{suggestion.name}</h3>
                      </div>
                    </InfoWindow>)
                })
              }
              {
                gasStations[0] && gasStations.map(suggestion => {
                  return (
                    <InfoWindow

                      key={suggestion.place_id}
                      zIndex={10}
                      position={{ lat: suggestion.geometry.location.lat, lng: suggestion.geometry.location.lng }}
                    >
                    <div style={{display: "flex", justifyContent:"center", alignItems:"center"}}>
                        <img src={gasIcon} style={{ width: "3em", margin: "1em" }}/>
                        <h3>{suggestion.name}</h3>
                      </div>
                    </InfoWindow>)
                })
              }
              {
                hotels[0] && hotels.map(suggestion => {
                  return (
                    <InfoWindow
                      key={suggestion.place_id}
                      zIndex={10}
                      position={{ lat: suggestion.geometry.location.lat, lng: suggestion.geometry.location.lng }}
                    >
                      <div style={{display: "flex", justifyContent:"center", alignItems:"center"}}>
                        <img src={hotelIcon} style={{ width: "3em", margin: "1em" }}/>
                        <h3>{suggestion.name}</h3>
                      </div>
                    </InfoWindow>)
                })
              }
            </GoogleMap>
      }
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
