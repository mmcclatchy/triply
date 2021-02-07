
import makeStyles from '@material-ui/core/styles/makeStyles';




const tripFormStyling = makeStyles(theme => ({
  formContainer: {
    width: '100%',
    display: 'flex',
    flexFlow: 'column',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  formControl: {
    minWidth: 350,
  },
  backOnRoad: {
    marginTop: '15px'
  },
  backOnRoadSelect: {
    width: '100%'
  },
  avoidTolls: {
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'center',
    minWidth: 350,
    '& label': { marginRight: '27px'}
  },
  foodCheckGroup: {
    width: 350,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
  foodCheckbox: {
    // width: 125,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    // margin: '0 10px',
    marginRight: 20,
  },
  additionalOption: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  optionField: {
    width: '100%',
    marginRight: 16
  },
}))


export default tripFormStyling