import React from 'react';
import './SDetails.css';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import HotelIcon from '@material-ui/icons/Hotel';
import LocalGasStationIcon from '@material-ui/icons/LocalGasStation';
import { Typography } from '@material-ui/core';
import BookButton from './BookButton';

const SDetails = ({ node, hotels, restaurants, gas }) => {
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
              {restaurants.map(e => {
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
                      <BookButton data={e} />
                    </div>
                  </>
                );
              })}
            </div>
          ) : null}

          {gas ? (
            <div>
              <h3>
                Gas Stations <LocalGasStationIcon />
              </h3>
              {gas.map(e => {
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
                      <BookButton data={e} />
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
              {hotels.map(e => {
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
                      <BookButton data={e} />
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
