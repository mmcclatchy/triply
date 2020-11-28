/* global google */
import React, {useState, useEffect } from "react";
import { GoogleMap, withScriptjs, withGoogleMap, DirectionsRenderer } from "react-google-maps"
import { TextField, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
//  use withScriptjs and withGoogleMap to wrap the map in order to get the map to load correctly


const InitMap = ({ }) => {
  const dispatch = useDispatch()
  const reduxOrigin = useSelector((state) => state.directionsRedux.origin)
  const reduxDestination = useSelector((state) => state.directionsRedux.destination)
  const reduxStartTime = useSelector((state) => state.directionsRedux.startTime)
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [originFormContent, setOriginFormContent] = useState("")
  const [destinationFormContent, setDestinationFormContent] = useState("")
  const [directions, setDirections] = useState(false)
  const directionsService = new google.maps.DirectionsService();
  const originField = document.getElementById("origin")
  const destinationField = document.getElementById("destination")
  const autoOrigin = new google.maps.places.Autocomplete(originField);
  const autoOrigin2 = new google.maps.places.Autocomplete(destinationField);

  useEffect(() => {

    if (!reduxOrigin && !reduxDestination) {
      return
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
          drivingOptions: {
            departureTime: new Date(reduxStartTime),
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK") {
            console.log(response.routes[0].legs[0].duration.text)
            console.log(response.routes[0].legs[0].distance.text)
            setDirections(response)
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );
    }
  setRoute()
  }, [origin,destination,dispatch])


  return (
    <>
    <GoogleMap
      defaultZoom={10}
      defaultCenter={{ lat: 40.991360, lng: -72.534203 }}
      >
        {directions ? <DirectionsRenderer directions={directions} /> : null}
    </GoogleMap>
    </>
  )
}


const WrappedMap = withScriptjs(withGoogleMap(InitMap));

//make sure to create .env.local file with REACT_APP_GOOGLE_KEY ="apikey"
export default function Map() {

  return (
    <div style={{ width: '50vw', height: '70vh' }}>
      <WrappedMap
        id="map"
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_KEY}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: "100% " }} />}
        containerElement={<div style={{ height: "100% ", marginLeft: `500px`, width: `500px` }} />}
        mapElement={<div style={{ height: "100% " }} />}
      />
    </div>
  );
}
