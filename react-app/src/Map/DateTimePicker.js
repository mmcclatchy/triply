import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { setStartTimeAction } from '../store/actions/directions';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import LuxonUtils from '@date-io/luxon';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '30vw',
    borderRadius: '.75em'
  },
  textField: {
    '& .MuiInputLabel-formControl': {
      background: 'white'
    }
  },
  textField: {
    width: 275,
    background: 'white',
    borderRadius: '.8em',
    position: '',
  }
}));

export default function DateAndTimePickers() {
  const dispatch = useDispatch();
  const classes = useStyles();
  //this fixes a bug with the iso format in the backend
  const [startTimeContent, setStartTimeContent] = useState(new Date().toISOString().split(".")[0]);
  console.log(startTimeContent)

  useEffect(() => {
    dispatch(setStartTimeAction(startTimeContent));
  }, [startTimeContent])

  const updateStartTime = e => {
    setStartTimeContent(e.target.value);
  };


  return (
    <div className='picker_container'>
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <KeyboardDateTimePicker
          variant="inline"
          label="Start Time"
          value={startTimeContent}
          onChange={setStartTimeContent}
          className={classes.textField}
          onError={console.log}
          disablePast
        />
      </MuiPickersUtilsProvider>
    </div>
  );
}
