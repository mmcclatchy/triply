import React from 'react';
import {
  makeStyles,
  Drawer as MuiDrawer,
  withStyles,
} from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Links from './Links';


const Drawer = withStyles({
  root: {
    '& .MuiPaper-root': {
      backgroundColor: '#e8e8e8',
      display: 'flex',
      flexFlow: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden'
    },
  }
})(MuiDrawer)




const useStyles = makeStyles((theme) => ({
  aboutMe: {
    fontWeight: 'bold',
    fontSize: "1.75rem",
    fontFamily: "gt-super, Georgia, Cambria, Times New Roman, Times, serif;",
    margin: "1em 1em -.5em 1em"
  },
  drawerButton: {
    marginLeft: "1.5em",
    backgroundColor: "rgba(34, 34, 34, .7)",
    color: 'rgb(255, 255, 255)',
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: 'bold',
    minHeight: "40px",
    width: "200px",
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    transition: 'background-color 300ms ease-in-out',
    // border: '2px solid rgba(34,34,34,.7)',
    "&:hover": {
      //you want this to be the same as the backgroundColor above
     backgroundColor: 'rgba(34,34,34,1)'
    },
  },
  email: {
    marginRight: "1.5em",
    textAlign: "center",
    color: "white",
    fontSize: "1.5em"
  },
  emailLink: {
    color: "white",
    "&:hover": {
      //you want this to be the same as the backgroundColor above
     color: "#74c69d"
    },
  },
  footer: {
    width: "100vw",
    // height: "12vh",
    // background: "black",
    position: 'absolute',
    bottom: -2,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  gitHub: {
    padding: ".4em",
    height: "2.3em",
    width: "2.3em",
    borderRadius: "2.3em"
  },
  icons: {
    display: "flex",
    alignItems: "center"
  },
  infoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: 'row',
    // backgroundColor: '#e8e8e8',
    width: '40%'
    // color: "white"
  },
  linkedIn: {
    heigh: "2em",
    width: "2em",
    marginRight: ".5em",
  },
  myInfo: {
    height: "40vh"
  },
  profilePic: {
    justifyContent: "center",
    height: "7em",
    width: "7em",
    borderRadius: "7em",
    padding: "1em"
  }
}))

export default function Footer() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const classes = useStyles();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }


  return (
    <>
      <div className={classes.footer}>
        <div
          onClick={() => setDrawerOpen(true)}
          className={classes.drawerButton}>
          <div>About the creators</div>
          <ExpandLessIcon />
        </div>
        <Drawer
          anchor="bottom"
          open={drawerOpen}
          onClose={toggleDrawer}
        >
          <div className={classes.infoContainer}>
            <img
              className={classes.profilePic}
              src="https://drama-deets.s3.amazonaws.com/AlyciaProfilePic.jpeg"
              alt="Profile Pic" />
            <span className={classes.aboutMe}>Alycia Wang
              <br></br>
              <Links 
                site=''
                linkedIn='https://www.linkedin.com/in/alycia-l-aba19279/'
                gitHub='https://github.com/ALW93'
              />
            </span>
          </div>
            
          <div className={classes.infoContainer}>
            <img
              className={classes.profilePic}
              src="https://drama-deets.s3.amazonaws.com/BrandonProfilepic.jpeg"
              alt="Profile Pic" 
            />
            <span className={classes.aboutMe}>Brandon Bartlett
              <br></br>
              <Links 
                site=''
                linkedIn='https://www.linkedin.com/in/brandon-bartlett-14026a112/'
                gitHub='https://github.com/bacbartlett'
              />
            </span>
          </div>
          
          <div className={classes.infoContainer}>
            <img
              className={classes.profilePic}
              src="https://drama-deets.s3.amazonaws.com/markProfilePic.jpeg"
              alt="Profile Pic" 
            />
            <span className={classes.aboutMe}>Mark McClatchy
              <br></br>
              <Links 
                site='https://markmcclatchy.com'
                linkedIn='https://www.linkedin.com/in/mark-mcclatchy-155367bb/'
                gitHub='https://github.com/mmcclatchy'
              />
            </span>
          </div>
          
          <div className={classes.infoContainer}>
            <img
              className={classes.profilePic}
              src="https://drama-deets.s3.amazonaws.com/ryanprofile.jpeg"
              alt="Profile Pic" 
            />
            <span className={classes.aboutMe}>Ryan Black
              <br></br>
              <Links 
                site='https://ryan-black.me/'
                linkedIn='https://www.linkedin.com/in/ryanblack045/'
                gitHub='https://github.com/ryanblack045'
              />
            </span>
          </div>
          
        </Drawer>
      </div>
    </>
  )
}
