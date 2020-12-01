import React, { useState } from 'react';
import './SDetails.css';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import HotelIcon from '@material-ui/icons/Hotel';
import LocalGasStationIcon from '@material-ui/icons/LocalGasStation';
import { Typography, Button, setRef } from '@material-ui/core';
import BookButton from './BookButton';

const SDetails = ({
  node,
  hotels,
  restaurants,
  gasStations,
  h,
  setH,
  g,
  setG,
  r,
  setR
}) => {
  const registerHotel = index => {
    console.log('new hotel');
    setH(() => new Set([...h, index]));
  };

  const registerRestaurant = index => {
    console.log('new food');
    setR(() => new Set([...r, index]));
  };

  const registerGas = index => {
    console.log('new gas');
    setG(() => new Set([...g, index]));
  };

  const checkBooked = (type, index) => {
    if (type === 'Restaurant') {
      return r.has(index);
    }
    if (type === 'GasStation') {
      return g.has(index);
    }
    if (type === 'Hotel') {
      return h.has(index);
    }
  };

  return (
    <>
      <div>
        <div className='sdetails__title'>
          <h2>Suggested Stop at {node.time.slice(10)}</h2>
        </div>

        <div className='sdetails__containers'>
          {restaurants ? (
            <div>
              <h3>
                Restaurants <FastfoodIcon />
              </h3>
              {restaurants.map((e, i) => {
                return (
                  <>
                    <div className='inner__details'>
                      <div>
                        <img width='70px' height='70px' src={e.img_url} />
                      </div>
                      <div>
                        <Typography variant='h6' component='h1'>
                          {e.name}
                        </Typography>
                        <Typography>
                          {e.city}, {e.state}
                        </Typography>
                      </div>

                      <BookButton
                        registerRestaurant={registerRestaurant}
                        registerGas={registerGas}
                        registerHotel={registerHotel}
                        index={i}
                        type={e.type}
                        booked={checkBooked(e.type, i)}
                      />
                    </div>
                  </>
                );
              })}
            </div>
          ) : null}

          {gasStations ? (
            <div>
              <h3>
                Gas Stations <LocalGasStationIcon />
              </h3>
              {gasStations.map((e, i) => {
                return (
                  <>
                    <div className='inner__details'>
                      <div>
                        <img width='70px' height='70px' src={e.img_url} />
                      </div>
                      <div>
                        <Typography variant='h6' component='h1'>
                          {e.name}
                        </Typography>
                        <Typography>
                          {e.city}, {e.state}
                        </Typography>
                      </div>

                      <BookButton
                        registerRestaurant={registerRestaurant}
                        registerGas={registerGas}
                        registerHotel={registerHotel}
                        index={i}
                        type={e.type}
                        booked={checkBooked(e.type, i)}
                      />
                    </div>
                  </>
                );
              })}
            </div>
          ) : null}

          {hotels ? (
            <div>
              <h3>
                Hotels <HotelIcon />
              </h3>
              {hotels.map((e, i) => {
                return (
                  <>
                    <div className='inner__details'>
                      <div>
                        <img width='70px' height='70px' src={e.img_url} />
                      </div>
                      <div>
                        <Typography variant='h6' component='h1'>
                          {e.name}
                        </Typography>
                        <Typography>
                          {e.city}, {e.state}
                        </Typography>
                      </div>

                      <BookButton
                        registerRestaurant={registerRestaurant}
                        registerGas={registerGas}
                        registerHotel={registerHotel}
                        index={i}
                        type={e.type}
                        booked={checkBooked(e.type, i)}
                      />
                    </div>
                  </>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default SDetails;
