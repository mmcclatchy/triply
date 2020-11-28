/* global google */
import React, { useState, useEffect } from "react";
import { NavLink, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { GoogleMap, withScriptjs, withGoogleMap, DirectionsRenderer } from "react-google-maps"
import { TextField, Button } from '@material-ui/core';
import { setOriginAction, setDestinationAction } from '../store/actions/directions';
//  use withScriptjs and withGoogleMap to wrap the map in order to get the map to load correctly


const RouteForm = ({}) => {
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [originFormContent, setOriginFormContent] = useState("")
  const [destinationFormContent, setDestinationFormContent] = useState("")
  const [directions, setDirections] = useState(false)
  const originField = document.getElementById("origin")
  const destinationField = document.getElementById("destination")
  const dispatch = useDispatch();
  const history = useHistory()
  // const autoOrigin = new google.maps.places.Autocomplete(originField);
  // const autoOrigin2 = new google.maps.places.Autocomplete(destinationField);

  // autoOrigin.setFields([
  //   "address_components",
  // ]);
  // autoOrigin2.setFields([
  //   "address_components",
  // ]);

    // autoOrigin.addListener("place_changed", () => {
    // const place = autoOrigin.getPlace();
    //    console.log(place)
    //    let address = "";
    //    if (place.address_components) {
    //       address = [
    //       (place.address_components[0] &&
    //         place.address_components[0].short_name) ||
    //         "",
    //       (place.address_components[1] &&
    //         place.address_components[1].short_name) ||
    //         "",
    //       (place.address_components[2] &&
    //         place.address_components[2].short_name) ||
    //         "",
    //       (place.address_components[5] &&
    //         place.address_components[5].short_name) ||
    //         "",
    //     ].join(" ");
    //    }
    //   console.log(address)
    //   setOriginFormContent(address)
    // })

    // autoOrigin2.addListener("place_changed", () => {
    //   const place = autoOrigin2.getPlace();
    //      console.log(place)
    //      let address = "";
    //      if (place.address_components) {
    //         address = [
    //         (place.address_components[0] &&
    //           place.address_components[0].short_name) ||
    //           "",
    //         (place.address_components[1] &&
    //           place.address_components[1].short_name) ||
    //           "",
    //         (place.address_components[2] &&
    //           place.address_components[2].short_name) ||
    //           "",
    //         (place.address_components[5] &&
    //           place.address_components[5].short_name) ||
    //             "",
    //       ].join(" ");
    //      }
    //   console.log(address)
    //   setDestinationFormContent(address)
    // })
  const handleClick = () => {
      setOrigin(originFormContent)
    setDestination(destinationFormContent)
    dispatch(setOriginAction(originFormContent))
    dispatch(setDestinationAction(destinationFormContent))
    return history.push(`/map`);
  }
  const updateOriginFormContent = (e) => {
    setOriginFormContent(e.target.value)
  }
  const updateDestinationFormContent = (e) => {
    setDestinationFormContent(e.target.value)
  }

  return (
    <>
      <TextField id="origin" label="Origin" variant="filled" value={originFormContent} onChange={updateOriginFormContent} />
      <TextField id="destination" label="Destination" variant="filled" value={destinationFormContent} onChange={updateDestinationFormContent} />
        <Button variant="contained" onClick={handleClick}>
          Submit
        </Button>
    </>
  )
}

export default RouteForm
