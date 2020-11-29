import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useDispatch } from 'react-redux';
import { setStartTimeAction } from '../store/actions/directions';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    width: '100vw',
    marginTop: '.5em',
    borderRadius: '.75em'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: '2vw',
    width: 275,
    background: 'white',
    borderRadius: '.8em'
  },
}));

export default function DateAndTimePickers() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [startTime, setStartTime] = useState("");
  const [startTimeContent, setStartTimeContent] = useState("");
  const updateStartTime = (e) => {
    setStartTimeContent(e.target.value)
    dispatch(setStartTimeAction(startTimeContent))

  }
  console.log(startTimeContent)
  return (
    <div className="picker_container">
      <form className={classes.container} noValidate>
      <TextField
        id="datetime"
        label="Start Time"
        type="datetime-local"
        value={startTimeContent}
        onChange = {updateStartTime}

        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </form>
    </div>
  );
}
