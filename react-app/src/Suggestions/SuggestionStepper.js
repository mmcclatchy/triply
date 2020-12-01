import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { algorithm } from './dummy_suggestions';
import { useDispatch } from 'react-redux';
import { postStop } from '../store/actions/stops';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SDetails from './SDetails';

class Test {
  constructor() {
    this.output = [];
  }

  newNode(data) {
    this.output.push(data);
  }
}

let foo = new Test();
foo.newNode(algorithm[0]);
foo.newNode(algorithm[1]);
foo.newNode(algorithm[2]);
foo.newNode(algorithm[3]);

const tripId = 1;

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  button: {
    marginRight: theme.spacing(1)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

const generateContent = array => {
  let obj = {};
  array.forEach((n, i) => {
    let step = obj[i + 1];
    if (step === undefined) {
      obj[i + 1] = n;
    }
  });
  return obj;
};

export default function SuggestionStepper() {
  const [steps, setSteps] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [h, setH] = useState(new Set());
  const [r, setR] = useState(new Set());
  const [g, setG] = useState(new Set());
  const [count, setCount] = useState(1);
  const [data, setData] = useState({});
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [gasStations, setGasStations] = useState([]);

  const classes = useStyles();
  const content = generateContent(foo.output);

  useEffect(() => {
    function getSteps() {
      const length = foo.output.length;
      const steps = [];
      for (let i = 0; i < length; i++) {
        steps.push(`Stop Option ${i + 1}`);
      }
      setSteps(steps);
    }
    getSteps();
  }, []);

  useEffect(() => {
    function getContent() {
      const info = content[activeStep + 1];
      if (info) {
        setData(info);
        setHotels(info.suggestions.Hotel);
        setRestaurants(info.suggestions.Restaurant);
        setGasStations(info.suggestions.Gas);
      }
    }
    getContent();
  }, [steps]);

  function getStepContent() {
    return (
      <SDetails
        node={{ time: data.time }}
        hotels={hotels}
        restaurants={restaurants}
        gasStations={gasStations}
        h={h}
        setH={setH}
        r={r}
        setR={setR}
        g={g}
        setG={setG}
      />
    );
  }

  const submitHandler = () => {
    console.log([...h, ...r, ...g]);
    if (h.size) {
      h.forEach(e => {
        const info = hotels[e];
        const new_stop = {
          trip_id: tripId,
          trip_stop_num: count,
          coordinates: data.coordinates,
          time: data.time
        };
        console.log(new_stop);
        // setStop(new_stop);
      });
    }
    if (r.size) {
      r.forEach(e => {
        const info = restaurants[e];
        const new_stop = {
          trip_id: tripId,
          trip_stop_num: count,
          coordinates: data.coordinates,
          time: data.time
        };
        console.log(new_stop);
        // setStop(new_stop);
      });
    }
    if (g.size) {
      g.forEach(e => {
        const info = gasStations[e];
        const new_stop = {
          trip_id: tripId,
          trip_stop_num: count,
          coordinates: data.coordinates,
          time: data.time
        };
        console.log(new_stop);
        // setStop(new_stop);
      });
    }

    setCount(prev => prev + 1);
    clearState();
  };

  // useEffect(() => {
  //   console.log(stop);
  //   //dispatch(postStop(stop, tripId));
  // }, [stop]);

  const clearState = () => {
    setH(() => new Set());
    setR(() => new Set());
    setG(() => new Set());
  };

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map(label => {
          const stepProps = {};
          const labelProps = {};

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              Generating Your Next Stop...
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>
            <div>
              <Button
                variant='contained'
                color='primary'
                onClick={() => {
                  handleNext();
                  submitHandler();
                }}
                className={classes.button}>
                Register Stops
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
