import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { showForm, hideForm } from '../store/actions/utilities';
import './User.css';
import TestForm from '../Car/TestForm';
import { getTrips } from '../store/actions/trips'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  title: {
    textAlign: "center",
    fontFamily: "Circular, - apple - system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans- serif",
    fontWeight: "bold",
    fontSize:"1.3em"
  },
  card: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    background: "yellow",
    width: "15.2em",
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    marginTop: "1em"
  },
  trip_header: {
    fontFamily: "Circular, - apple - system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans- serif",
    fontWeight: "bold",
    fontSize: "2em",
    textAlign: "center",
    marginTop: "1em",
    marginBottom: ".5em"
  },
  profile_title: {
    fontFamily: "Circular, - apple - system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans- serif",
    fontWeight: "bold",
    fontSize: "3.5em",
    // fontFamily: "Anton, sans-serif",
    // fontSize: "70px",
    // color: "rgb(253, 210, 0)",
    // letterSpacing: "0.2px",
    // webkitTextStroke: "3px rgb(34, 34, 30)",
    // fontWeight: 400,
    // textDecoration: "none",
    // fontStyle: "normal",
    // fontVariant: "normal",
    textAlign: "center",
    marginTop: "-1em"
  },
  card_container: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap"
  },
  card_header: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize:"1.2em"
  },
  card_info: {
    textAlign: "center"
  },
  cardContent: {
    display: "flex",
    alignItems: "center",
  },
  button_container:{
  textAlign: "center"
  },
  car_button: {
    background: 'linear-gradient(45deg, #0000ff 30%, #ccccff 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    marginTop: "1em",
    marginBottom: "1em",
  },
  cancel_button: {
    background: 'red',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    marginTop: "-1em",
    marginLeft: "20%"
  },
  car_creator_container: {
   marginTop: "1%",
   marginLeft: "30%",
  },
  container:{

  }
});

function User({ userId }) {
  const [user, setUser] = useState({});
  const [cars, setCars] = useState([]);
  const [gettingCars, setGettingCars] = useState(0)
  const classes= useStyles()
  const dispatch = useDispatch();
  const visible = useSelector(state => state.utilities.formVisible);
  const trips = useSelector(state => state.trips.payload.trips)
  // const trips = ""

  useEffect(() => {
    (async () => {
      console.log("getting users")
      const response = await fetch(`/api/users/${userId}`);
      const user = await response.json();
      setUser(user);
    })();
  }, []);

  useEffect(() => {
    const getCars = async () => {
      console.log("check here")
      const response = await fetch(`/api/users/${userId}/cars`);
      const data = await response.json();
      setCars(data.cars);
    };
    getCars();
  }, [gettingCars]);

  useEffect(() => {
    console.log("trippppppssss",trips)
    dispatch(getTrips(userId))

  }, []);

  if (!user) {
    return null;
  }

  return (

    <div >
      <div className={classes.profile_title}>
        {user.username}'s Profile
      </div>
      <div className={classes.trip_header}>Your Trips</div>
      <div className={classes.card_container}>
        {Object.values(trips).map(value => {
          const current = value
          return (
            <>
              <Card variant="outlined" className={classes.card}>
                <CardContent clasName={classes.cardContent}>
                 <Typography variant="h5" className={classes.title}>
                 {value.name}
                 </Typography>
                  <div className={classes.card_header}>
                    Starting Point
                  </div>
                  <div className={classes.card_info}>
                  {value.startLocation.replace(/"/g, "")}
                  </div>
                  <div className={classes.card_header}>
                    Destination
                  </div>
                  <div className={classes.card_info}>
                   {value.endLocation.replace(/"/g, "")}
                  </div>
                </CardContent>
              </Card>
            </>
          )
        })}
      </div>
      <div className={classes.container}>
        <div className={classes.trip_header}>Your Cars </div>
        <div className={classes.card_container}>
        {cars &&
          Object.keys(cars).map(key => {
            const current = cars[`${key}`];

            return (
              <div key={current.id}>
                <Card className={classes.card} variant="outlined">
                  <CardContent>
                    <div className={classes.card_header}>
                    {current.year} {current.make} {current.model}
                    </div>
                    <div className={classes.card_info}>
                   ({current.mpg}{' '}
                      mpg)
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
          </div>
      </div>

      {visible ? (
        <>
          <div className={classes.car_creator_container}>
          <TestForm setGettingCars={setGettingCars} />
          <Button
            className={classes.cancel_button}
            onClick={() => dispatch(hideForm())}>
              Cancel
          </Button>
          </div>
        </>
      ) : (
        <div className={classes.button_container}>
          <Button className={classes.car_button}
            onClick={() => dispatch(showForm())}
          >Add a New Car</Button>
        </div>
      )}
    </div>
  );
}
export default User;
