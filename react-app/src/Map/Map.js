/* global google */
import React, {useState, useEffect } from "react";
import { GoogleMap, withScriptjs, withGoogleMap, DirectionsRenderer } from "react-google-maps"
import { TextField, Button } from '@material-ui/core';
//  use withScriptjs and withGoogleMap to wrap the map in order to get the map to load correctly


function InitMap() {
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [originFormContent, setOriginFormContent] = useState("")
  const [destinationFormContent, setDestinationFormContent] = useState("")
  const [directions, setDirections] = useState(false)
  const directionsService = new google.maps.DirectionsService();
  const handleClick = () => {
      setOrigin(originFormContent)
      setDestination(destinationFormContent)
  }
  const updateOriginFormContent = (e) => {
    setOriginFormContent(e.target.value)
  }
  const updateDestinationFormContent = (e) => {
    setDestinationFormContent(e.target.value)
  }
  // const directionsRenderer = new google.maps.DirectionsRenderer();
  useEffect(() => {
    if (!origin && !destination) {
      return
    }
    const setRoute = () => {
      directionsService.route(
        {
          origin: {
            query: origin
          },
          destination: {
            query: destination
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK") {
            console.log("hiii")
            setDirections(response)
          } else {
            window.alert("Directions request failed due to " + status);
          }
        }
      );
    }
  setRoute()
  }, [origin,destination])


  return (
    <>
    <GoogleMap
      defaultZoom={10}
      defaultCenter={{ lat: 40.991360, lng: -72.534203 }}
      >
        {directions ? <DirectionsRenderer directions={directions} /> : null}
    </GoogleMap>
      <TextField id="origin" label="Origin" variant="filled" value={originFormContent} onChange={updateOriginFormContent} />
      <TextField id="destination" label="Destination" variant="filled" value={destinationFormContent} onChange={updateDestinationFormContent} />
      <Button variant="contained" onClick={handleClick}>
        Submit
      </Button>
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
