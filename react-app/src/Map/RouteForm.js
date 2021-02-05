import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import {makeStyles} from '@material-ui/core/styles'
import { TextField, Button } from '@material-ui/core';
import {
  setOriginAction,
  setDestinationAction
} from '../store/actions/directions';
import './RouteForm.css';
import { postTrip } from '../store/actions/trips';
import TimePicker from '../Map/DateTimePicker';
//  use withScriptjs and withGoogleMap to wrap the map in order to get the map to load correctly

const RouteForm = ({}) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originFormContent, setOriginFormContent] = useState('');
  const [destinationFormContent, setDestinationFormContent] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();
  const loggedIn = useSelector(state => state.authentication.auth);



  const handleClick = () => {
    setOrigin(originFormContent);
    setDestination(destinationFormContent);
    dispatch(setOriginAction(originFormContent));
    dispatch(setDestinationAction(destinationFormContent));

    return history.push(`/create-trip`);
  };
  const updateOriginFormContent = e => {
    setOriginFormContent(e.target.value);
  };
  const updateDestinationFormContent = e => {
    setDestinationFormContent(e.target.value);
  };

  const today = new Date()

  return (
    <>
      <div className='route_form'>
        {loggedIn ?
      <>
        <div
          className='form_header'
          style={{fontSize:'2em', marginRight:'0', marginBottom:'0'}}
        >
            To get started fill out the fields below.
          </div>
        <div className='route_input_container'>
          <TextField
            id='origin'
            className='route_form_input'
            placeholder='Where are you starting from?'
            variant='standard'
            InputProps={{ disableUnderline: true }}
            inputProps={{ style: { textAlign: 'center' } }}
            value={originFormContent}
            onChange={updateOriginFormContent}
          />
        </div>
        <div className='route_input_container' style={{marginBottom:"1em"}}>
          <TextField
            id='destination'
            placeholder='Where are you going?'
            InputProps={{ disableUnderline: true }}
            inputProps={{ style: { textAlign: 'center' } }}
            className='route_form_input'
            variant='standard'
            value={destinationFormContent}
            onChange={updateDestinationFormContent}
            />
        </div>
        <div className='buttons'>
          <TimePicker  />
        </div>
        <div className='submit_container'>
          <Button
            className='submit_route'
            variant='contained'
            style={{
              backgroundColor: 'rgb(253, 210, 0)',
              fontWeight: 'bold',
              border: '2px solid rgba(34,34,34,.6)'
            }}
            onClick={handleClick}>
              Set Route
          </Button>
        </div>
      </>
          : <div
              className='form_header'
              style={{ fontSize: '2em', marginRight: '0', marginBottom: '0' }}>
            To get started login or sign up
            </div>
          }
      </div>
    </>
  );
};

export default RouteForm;
