import React from 'react';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import MuiDrawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Button, withStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';

import User from '../Profile/User';
import LoginForm from '../Login/LoginForm';
import SignUp from '../Signup/SignUpForm';

//*********************  Styling  ***************************//

const Drawer = withStyles({
  // root: { width: '25%' },
  paper: {
    backgroundColor: 'var(--off-white)',
    alignItems: 'center',
    width: "550px"
  }
})(MuiDrawer)


const useStyles = makeStyles({
  list: {
    width: '85%',
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
  },
  return_home: {
    justifySelf: 'flex-start',
  },
  closeContainer: {
    display: 'flex',
    width: '100%',
    marginTop: '20px',
  }
});


//*****************  Component  *********************//


export default function TemporaryDrawer({
  anchor,
  setAuthenticated,
  variant,
  color
}) {
  const classes = useStyles();
  const userId = useSelector(state => state.authentication.userId);
  const [state, setState] = React.useState({
    anchor: false
  });

  const toggleDrawer = (anchor, open) => event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const showProfile = anchor => {
    return (
      <div className={classes.list}>
        <div className={classes.closeContainer}>
          <IconButton 
            className={classes.return_home}
            onClick={toggleDrawer(anchor, false)}
          >
            <CancelIcon   />
          </IconButton>
        </div>
        {anchor === 'My Profile' ? <User userId={userId} /> : null}
        {anchor === 'Login' ? (
          <LoginForm setAuthenticated={setAuthenticated} />
        ) : null}
        {anchor === 'Sign Up' ? (
          <SignUp setAuthenticated={setAuthenticated} />
        ) : null}
      </div>
    );
  };

  return (
    <>
      <Button
        variant='contained'
        style={{
          backgroundColor: 'var(--yellow)',
          fontWeight: 'bold',
          border: 'none',
          width: '125px',
          '&:hover': { backgroundColor: 'var(--yellow-dark' },
        }}
        // color={color}
        onClick={toggleDrawer(anchor, true)}
        className='homepage__button'>
        {anchor}
      </Button>
      <Drawer
        anchor='right'
        open={state[anchor]}
        onClose={toggleDrawer(anchor, false)}>
        {showProfile(anchor)}
      </Drawer>
    </>
  );
}
