import React from 'react';
import { useSelector } from 'react-redux';
import StartOfTripForm from "../StartOfTripForm/StartOfTripForm"

const TripSummary = () => {
  const userName = useSelector((state) => state.authentication.userName)
  const distance = useSelector((state) => state.directionsRedux.distance)
  const duration = useSelector((state) => state.directionsRedux.duration)
  const origin = useSelector((state) => state.directionsRedux.origin)
  const destination = useSelector((state) => state.directionsRedux.destination)
  const startTime = useSelector((state) => state.directionsRedux.startTime)

  return (
    <>
      <StartOfTripForm />
      <div className="trip_summary_container">
        <h1>{userName}'s Trip</h1>
        <h3>Origin: {origin}</h3>
        <h3>Destination: {destination}</h3>
        <h3>Start Time: {startTime} </h3>
        <h3>Duration: {duration}</h3>
        <h3>Distance: {distance}</h3>
      </div>
    </>
  );
};

export default TripSummary
