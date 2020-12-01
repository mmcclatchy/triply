import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { algorithm } from './dummy_suggestions';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SDetails from './SDetails';

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

const content = generateContent(algorithm);

function getSteps() {
  const length = algorithm.length;
  const steps = [];
  for (let i = 0; i < length; i++) {
    steps.push(`Stop Option ${i + 1}`);
  }
  return steps;
}

function getStepContent(step) {
  const data = content[step + 1];
  return (
    <SDetails
      node={{ coordinates: data.coordinates, time: data.time }}
      hotels={data.suggestions.Hotel}
      restaurants={data.suggestions.Restaurant}
      gas={data.suggestions.Gas}
    />
  );
}

export default function SuggestionStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
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
              All stops booked - enjoy your trip!
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
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}>
                Back
              </Button>

              <Button
                variant='contained'
                color='primary'
                onClick={handleNext}
                className={classes.button}>
                {activeStep === steps.length - 1 ? 'Register Stops' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
