import React, {useState, useEffect} from "react"
import {useDispatch} from "react-redux"
import { useHistory } from "react-router-dom"
import {setDuration} from "../store/actions/setDuration"


const StartOfTripForm = (props) =>{
  const dispatch = useDispatch()
  const history = useHistory()

  const [stopTime, setStopTime] = useState(5400)
  const [sleepTime, setSleepTime]= useState(18000)
  const [tolls, setTolls] = useState(false)
  const [options, setOptions] = useState(["Mexican", "Fast Food", "Pizza", "Asain", "American"])
  const [additionalOption, setAdditionalOption] = useState("")
  const [selectedFoods, setSelectedFoods] = useState([])

  const handleStopChange =(e) => setStopTime(e.target.value)
  const handleSleepChange = (e) => setSleepTime(e.target.value)
  const handleCheck = (e) => {setTolls(e.target.checked)}
  const saveInfo = e =>{
    const op = document.getElementById("options").childNodes;
    const selectedFood = []
    op.forEach(el=>{
      if(el.lastChild.checked){
        selectedFood.push(el.lastChild.id)
      }
    })
    dispatch(setDuration({daily_timelimit: sleepTime, stop_timelimit: stopTime, avoidTolls: tolls, selectedFoods: selectedFood}))
    history.push("/create-trip")
  }
  const handleAdditionalOptionChange = (e) => setAdditionalOption(e.target.value)
  const handleAdditionalOptionAddition = (e) => {
    if(!additionalOption){
      return
    }
    let o = options;
    o.push(additionalOption)
    console.log("adding")
    console.log(o)
    setOptions(o)
    setAdditionalOption("")
    
  }

  useEffect(()=>{
    if(options.length === 5){
      return
    }
    const newBox = document.getElementById("options").lastChild.lastChild
    console.log(newBox)
    newBox.checked = true
    console.log("Hello")
  }, [options.length])

  const handleCheckOfFood = (e) => {
    if(e.target.value){
      let s = selectedFoods;
      s.push(e.target.id)
      setSelectedFoods(s)
    } else{
      let s = selectedFoods;
      let i = s.findIndex(e.target.id)
      if(i === -1){
        return
      }
      s.slice(i, 1)
      setSelectedFoods(s)
      console.log(s)
    }
  }
  
  


  return(
    <div className="StartOfTripForm">
      <label>How Often Do You Want To Stop?</label>
      <select value={stopTime} onChange={handleStopChange}>
        <option value={5400}>Every Hour or Two</option>
        <option value={9000}>Every Two or Three Hours</option>
        <option value={10800}>Every Three or Four Hours</option>
        <option value={"Never"}>Only When I Will Run Out of Gas</option>
      </select>
      <p>{stopTime}</p>
      <label>How often do you want to sleep?</label>
      <select value={sleepTime} onChange={handleSleepChange}>
        <option value={18000}>Every Four to Six Hours</option>
        <option value={28800}>Every Seven to Nine Hours</option>
        <option value={39600}>Every Ten to Twelve Hours</option>
        <option value={14400}>Every Thirteen to Fifteen Hours</option>
        <option value={"Never"}>What's a sleep?</option>
      </select>
      <p>{sleepTime}</p>
      <label>Avoid Toll Roads? (Often requires a longer route)</label>
      <input type={"checkbox"} checked={tolls} onClick={handleCheck} />
      <br />
      <br />
      <label>Choose some food types you'd like to eat, or add your own</label>
      <div id="options">
      {options.map((el, i )=> (<div><label key={i * 2}>{el}</label> <input key={i*2 +1} type="checkbox" onChange={handleCheckOfFood} className={el} id={el} /></div>))}
      </div>
      <input onChange={handleAdditionalOptionChange} value={additionalOption} />
      <button onClick={handleAdditionalOptionAddition}>Add Option</button>
      <br></br>
      <button onClick={saveInfo}>Save This Information</button>
    </div>

  )
}

export default StartOfTripForm
