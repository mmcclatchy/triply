/* global google */
import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
const{
withScriptjs,
withGoogleMap,
GoogleMap,
DirectionsRenderer,
} = require("react-google-maps");
const { compose, withProps, lifecycle } = require ("recompose");
//  use withScriptjs to wrap the map in order to get the map to load correctly

const MapWithADirectionsRenderer = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px`, marginLeft: `500px`, width: `500px`}} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      const DirectionsService = new google.maps.DirectionsService();

      DirectionsService.route({
        origin: new google.maps.LatLng(40.991360, -72.534203),
        destination: new google.maps.LatLng(36.099861, -80.244217),
        travelMode: google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      });
    }
  })
)(props =>
  <GoogleMap
    defaultZoom={7}
    defaultCenter={new google.maps.LatLng(41.8507300, -87.6512600)}
  >
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
);


export default function Map() {
  return (
        <>
          <div style ={{width: '50vw', height: '70vh'}}>
          <MapWithADirectionsRenderer />
          </div>

          <div>
            <TextField id="origin" label="Origin" variant="filled" />
            <TextField id="origin" label="Destination" variant="filled" />
          </div>
          <Button variant="contained">
          Submit
           </Button>
        </>
      );
   }
