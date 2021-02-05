import React from 'react';
import {
  makeStyles,
  Drawer
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  aboutMe: {
    fontSize: "1em",
    fontFamily: "gt-super, Georgia, Cambria, Times New Roman, Times, serif;",
    margin: "1em 1em -.5em 1em"
  },
  drawer: {
  },
  drawerButton: {
    marginLeft: "1.5em",
    color: "yellow",
    cursor: "pointer",
    fontSize: "1em",
    height: "auto",
    width: "fit-content",
    "&:hover": {
      //you want this to be the same as the backgroundColor above
     color: "#74c69d"
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
    bottom: 0,
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
    justifyContent: "center",
    background: "black",
    color: "yellow"
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
          About the creators
          </div>
          <Drawer
          anchor="bottom"
          className={classes.drawer}
          open={drawerOpen}
          onClose={toggleDrawer}>
          <div className={classes.infoContainer}>
          <img
            className={classes.profilePic}
            src="https://drama-deets.s3.amazonaws.com/AlyciaProfilePic.jpeg"
              alt="Profile Pic" />
            <span className={classes.aboutMe}>Hi! My name is Ryan, I'm an artist/software engineer based in NYC. I hope that you find this site is useful, if you have any ideas or suggestions I'd be happy to hear from you. Also my github and linkedIn pages are listed below.
              <br></br>
              <span className={classes.icons}>
              <a
                href="https://www.linkedin.com/in/alycia-l-aba19279/"
                className={classes.aTag}>
                <img
                  className={classes.linkedIn}
                  src="https://drama-deets.s3.amazonaws.com/linkedin.svg"
                  alt="LinkedIn icon"/>
              </a>
              <a
                href="https://github.com/ALW93"
                className={classes.aTag}>
                <img
                  className={classes.gitHub}
                  src="https://drama-deets.s3.amazonaws.com/githubIcon.png"
                  alt="Github icon"/>
                </a>
                </span>
            </span>
          </div>
          <div className={classes.infoContainer}>
          <img
            className={classes.profilePic}
            src="https://drama-deets.s3.amazonaws.com/BrandonProfilepic.jpeg"
              alt="Profile Pic" />
            <span className={classes.aboutMe}>Hi! My name is Ryan, I'm an artist/software engineer based in NYC. I hope that you find this site is useful, if you have any ideas or suggestions I'd be happy to hear from you. Also my github and linkedIn pages are listed below.
              <br></br>
              <span className={classes.icons}>
              <a
                href="https://www.linkedin.com/in/brandon-bartlett-14026a112/"
                className={classes.aTag}>
                <img
                  className={classes.linkedIn}
                  src="https://drama-deets.s3.amazonaws.com/linkedin.svg"
                  alt="LinkedIn icon"/>
              </a>
              <a
                href="https://github.com/bacbartlett"
                className={classes.aTag}>
                <img
                  className={classes.gitHub}
                  src="https://drama-deets.s3.amazonaws.com/githubIcon.png"
                  alt="Github icon"/>
                </a>
                </span>
            </span>
          </div>
          <div className={classes.infoContainer}>
          <img
            className={classes.profilePic}
            src="https://drama-deets.s3.amazonaws.com/markProfilePic.jpeg"
              alt="Profile Pic" />
            <span className={classes.aboutMe}>Hi! My name is Ryan, I'm an artist/software engineer based in NYC. I hope that you find this site is useful, if you have any ideas or suggestions I'd be happy to hear from you. Also my github and linkedIn pages are listed below.
              <br></br>
              <span className={classes.icons}>
              <a
                href="https://www.linkedin.com/in/mark-mcclatchy-155367bb/"
                className={classes.aTag}>
                <img
                  className={classes.linkedIn}
                  src="https://drama-deets.s3.amazonaws.com/linkedin.svg"
                  alt="LinkedIn icon"/>
              </a>
              <a
                href="https://github.com/mmcclatchy"
                className={classes.aTag}>
                <img
                  className={classes.gitHub}
                  src="https://drama-deets.s3.amazonaws.com/githubIcon.png"
                  alt="Github icon"/>
                </a>
                </span>
            </span>
          </div>
          <div className={classes.infoContainer}>
          <img
            className={classes.profilePic}
            src="https://drama-deets.s3.amazonaws.com/ryanprofile.jpeg"
              alt="Profile Pic" />
            <span className={classes.aboutMe}>Hi! My name is Ryan, I'm an artist/software engineer based in NYC. I hope that you find this site is useful, if you have any ideas or suggestions I'd be happy to hear from you. Also my github and linkedIn pages are listed below.
              <br></br>
              <span className={classes.icons}>
              <a
                href="https://www.linkedin.com/in/ryanblack045/"
                className={classes.aTag}>
                <img
                  className={classes.linkedIn}
                  src="https://drama-deets.s3.amazonaws.com/linkedin.svg"
                  alt="LinkedIn icon"/>
              </a>
              <a
                href="https://github.com/ryanblack045"
                className={classes.aTag}>
                <img
                  className={classes.gitHub}
                  src="https://drama-deets.s3.amazonaws.com/githubIcon.png"
                  alt="Github icon"/>
                </a>
                </span>
            </span>
          </div>
          </Drawer>
      </div>
    </>
  )
}
