import React from 'react';

import webIcon from './www.svg';
import makeStyles from '@material-ui/core/styles/makeStyles';


const useStyles = makeStyles(() => ({
  links: {
    margin: '0',
    
    '& .my-site, .linked-in, .github': {
        maxWidth: '30px',
        minWidth: '30px',
        margin: '20px 10px',
    },
  },


  tooltip: {
      display: 'inline-block',
      position: 'relative',
      textAlign: 'left',
      
      '& .top': {
          minWidth: '15px', 
          top: '-20px',
          left: '50%',
          transform: 'translate(-50%, -100%)',
          padding: '10px 20px',
          color: '#222',
          backgroundColor: '#cecdcd',
          fontWeight: 'bold',
          fontSize: '13px',
          borderRadius: '8px',
          position: 'absolute',
          zIndex: 99999999,
          boxSizing: 'border-box',
          border: '1px solid #222',
          boxShadow: '0 1px 8px rgba(0,0,0,0.5)',
          visibility: 'hidden', 
          opacity:0, 
          transition: 'opacity 0.3s ease-in-out',    
      },
      
      '&:hover .top': {
          visibility: 'visible', 
          opacity:1,
      },
      
      '& .top i': {
          position: 'absolute',
          top: '100%',
          left: '50%',
          marginLeft: -12,
          width: 24,
          height: 12,
          overflow: 'hidden',
      },
      
      '& .top i::after': {
          content: '',
          position: 'absolute',
          width: 12,
          height: 12,
          left: '50%',
          transform: 'translate(-50%,-50%) rotate(45deg)',
          backgroundColor: '#888888',
          border: '1px solid #222',
          boxShadow: '0 1px 8px rgba(0,0,0,0.5)',
      },
  },
}))


export default function Links({ site, linkedIn, gitHub }) {
  const classes = useStyles();
  
  return (
    
    <div className={classes.links}>
      
      {
        site && <a
          href={site} 
          target="_blank" 
          rel="noopener noreferrer"
            className={classes.tooltip}
        >
          <img src={webIcon} className='my-site' alt='my site link'/>
          <div className="top">
            <p>MySite</p>
          </div>
        </a>
      }
      
      <a 
        href={linkedIn} 
        target="_blank" 
        rel="noopener noreferrer"
          className={classes.tooltip}
      >
        <img 
          src='https://www.vectorlogo.zone/logos/linkedin/linkedin-icon.svg' 
          alt='LinkedIn link'
          className='linked-in' />
        <div className="top">
          <p>LinkedIn</p>
        </div>
      </a>
      
      <a 
        href={gitHub} 
        target="_blank" 
        rel="noopener noreferrer"
        className={classes.tooltip}
      > 
        <img 
          src="https://www.vectorlogo.zone/logos/github/github-icon.svg"
          alt='github link'
          className='github' />
        <div className="top">
          <p>GitHub</p>
        </div>
      </a>
      
    </div>
  )
}