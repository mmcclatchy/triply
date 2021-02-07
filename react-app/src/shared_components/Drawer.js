import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import User from '../Profile/User';
import LoginForm from '../Login/LoginForm';
import SignUp from '../Signup/SignUpForm';
import { Button } from '@material-ui/core';

const useStyles = makeStyles({
  list: {
    width: 940
  },
  return_home: {
      background: "white",
      borderRadius: 10,
      color: 'Black',
      height: "2em",
      width: "1em",
      marginLeft: "2em",
      marginTop: "2em",
      textAlign: "center",
      fontWeight: "bold"

  }
});

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
        <List>
          <ListItem button className={classes.return_home} key='Home' onClick={toggleDrawer(anchor, false)}>
            X
          </ListItem>
        </List>
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
        variant="contained"
        style={{
          backgroundColor: "rgb(253, 210, 0)",
          fontWeight: "bold",
          border: "none",
          width: '125px'
        }}
        color={color}
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
